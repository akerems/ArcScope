import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { z } from "zod";
import { analyzeAddress } from "@/lib/arc/analysis";
import { ExplorerClientError } from "@/lib/arc/explorer-client";
import {
  DEFAULT_QUERY_LIMIT,
  MAX_QUERY_LIMIT,
} from "@/lib/arc/constants";
import { checkRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ address: string }>;
};

const querySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_QUERY_LIMIT)
    .default(DEFAULT_QUERY_LIMIT),
  refresh: z.enum(["true", "false"]).default("false"),
});

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(request: Request, context: RouteContext) {
  const { address } = await context.params;
  if (!isAddress(address)) {
    return errorResponse(
      "INVALID_ADDRESS",
      "Enter a valid EVM address.",
      400,
    );
  }

  const url = new URL(request.url);
  const queryResult = querySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    refresh: url.searchParams.get("refresh") ?? undefined,
  });
  if (!queryResult.success) {
    return errorResponse("INVALID_QUERY", "Invalid analysis options.", 400);
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() ?? "anonymous";
  const rateLimit = checkRateLimit(clientKey);
  if (!rateLimit.allowed) {
    const response = errorResponse(
      "RATE_LIMITED",
      "Too many analyses. Please wait a minute and try again.",
      429,
    );
    response.headers.set(
      "Retry-After",
      Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
    );
    return response;
  }

  try {
    const analysis = await analyzeAddress(address, {
      limit: queryResult.data.limit,
      refresh: queryResult.data.refresh === "true",
    });
    const response = NextResponse.json(analysis);
    response.headers.set(
      "Cache-Control",
      queryResult.data.refresh === "true"
        ? "no-store"
        : "public, s-maxage=300, stale-while-revalidate=3600",
    );
    response.headers.set("X-RateLimit-Remaining", `${rateLimit.remaining}`);
    return response;
  } catch (error) {
    if (error instanceof ExplorerClientError) {
      const statuses = {
        RATE_LIMITED: 429,
        TIMEOUT: 504,
        UNAVAILABLE: 503,
        INVALID_RESPONSE: 502,
      } as const;
      const messages = {
        RATE_LIMITED:
          "Arcscan is receiving too many requests. Please try again shortly.",
        TIMEOUT: "Arcscan took too long to respond. Please try again.",
        UNAVAILABLE:
          "Arcscan is temporarily unavailable. Please try again shortly.",
        INVALID_RESPONSE:
          "Arcscan returned data we could not process safely.",
      } as const;
      return errorResponse(
        error.code,
        messages[error.code],
        statuses[error.code],
      );
    }
    return errorResponse(
      "SERVER_ERROR",
      "The analysis could not be completed.",
      500,
    );
  }
}

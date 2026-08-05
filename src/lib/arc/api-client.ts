import type { AddressAnalysis } from "@/types/arc";

export class AddressApiError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "AddressApiError";
  }
}

type FetchAnalysisOptions = {
  limit?: number;
  refresh?: boolean;
};

export async function fetchAddressAnalysis(
  address: string,
  options: FetchAnalysisOptions = {},
): Promise<AddressAnalysis> {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.refresh) params.set("refresh", "true");
  const response = await fetch(
    `/api/address/${encodeURIComponent(address)}?${params}`,
    { cache: options.refresh ? "no-store" : "default" },
  );
  const payload: unknown = await response.json();
  if (!response.ok) {
    const error =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "object" &&
      payload.error !== null
        ? payload.error
        : null;
    const code =
      error && "code" in error && typeof error.code === "string"
        ? error.code
        : "SERVER_ERROR";
    const message =
      error && "message" in error && typeof error.message === "string"
        ? error.message
        : "The analysis could not be completed.";
    throw new AddressApiError(code, message);
  }
  return payload as AddressAnalysis;
}

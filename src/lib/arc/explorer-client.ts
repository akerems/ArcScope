import { z } from "zod";
import { arcTestnet } from "@/lib/arc/config";
import { EXPLORER_TIMEOUT_MS } from "@/lib/arc/constants";

const addressRefSchema = z.object({
  hash: z.string(),
  is_contract: z.boolean().nullable().optional(),
  name: z.string().nullable().optional(),
  metadata: z.unknown().nullable().optional(),
});

const addressSchema = addressRefSchema.extend({
  coin_balance: z.string().nullable().optional(),
  has_token_transfers: z.boolean().optional(),
  has_tokens: z.boolean().optional(),
  is_verified: z.boolean().nullable().optional(),
  creation_transaction_hash: z.string().nullable().optional(),
});

const transactionSchema = z.object({
  hash: z.string(),
  from: addressRefSchema,
  to: addressRefSchema.nullable(),
  created_contract: addressRefSchema.nullable().optional(),
  value: z.string(),
  timestamp: z.string().nullable(),
  status: z.string().nullable(),
  result: z.string().nullable().optional(),
  method: z.string().nullable().optional(),
});

const tokenSchema = z.object({
  address_hash: z.string(),
  decimals: z.string().nullable(),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  type: z.string(),
});

const tokenTransferSchema = z.object({
  from: addressRefSchema,
  to: addressRefSchema,
  token: tokenSchema,
  total: z.object({
    decimals: z.string().nullable(),
    value: z.string(),
  }),
  transaction_hash: z.string(),
  timestamp: z.string().nullable(),
});

const internalTransactionSchema = z.object({
  from: addressRefSchema,
  to: addressRefSchema.nullable(),
  created_contract: addressRefSchema.nullable().optional(),
  transaction_hash: z.string(),
  timestamp: z.string().nullable(),
  value: z.string(),
  success: z.boolean(),
});

const tokenBalanceSchema = z.object({
  token: tokenSchema,
  value: z.string(),
  token_id: z.string().nullable().optional(),
});

const addressCountersSchema = z.object({
  transactions_count: z.string(),
  token_transfers_count: z.string(),
  gas_usage_count: z.string(),
  validations_count: z.string(),
});

const paginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), next_page_params: z.unknown().optional() });

export type ExplorerAddressRef = z.infer<typeof addressRefSchema>;
export type ExplorerAddress = z.infer<typeof addressSchema>;
export type ExplorerTransaction = z.infer<typeof transactionSchema>;
export type ExplorerTokenTransfer = z.infer<typeof tokenTransferSchema>;
export type ExplorerInternalTransaction = z.infer<
  typeof internalTransactionSchema
>;
export type ExplorerTokenBalance = z.infer<typeof tokenBalanceSchema>;

export type ExplorerAddressData = {
  address: ExplorerAddress;
  counters: z.infer<typeof addressCountersSchema>;
  transactions: ExplorerTransaction[];
  tokenTransfers: ExplorerTokenTransfer[];
  internalTransactions: ExplorerInternalTransaction[];
  tokenBalances: ExplorerTokenBalance[];
};

export class ExplorerClientError extends Error {
  constructor(
    public readonly code:
      | "RATE_LIMITED"
      | "TIMEOUT"
      | "UNAVAILABLE"
      | "INVALID_RESPONSE",
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ExplorerClientError";
  }
}

function buildExplorerUrl(path: string): URL {
  const base = arcTestnet.explorerApiUrl.replace(/\/+$/, "");
  const url = new URL(`${base}/${path.replace(/^\/+/, "")}`);
  const apiKey = process.env.BLOCKSCOUT_API_KEY;
  if (apiKey) url.searchParams.set("apikey", apiKey);
  return url;
}

/** Fetches one fixed Blockscout route with a bounded timeout and safe errors. */
async function fetchExplorer<T>(
  path: string,
  schema: z.ZodType<T>,
  bypassCache: boolean,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXPLORER_TIMEOUT_MS);

  try {
    const response = await fetch(buildExplorerUrl(path), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: bypassCache ? "no-store" : "force-cache",
      next: bypassCache ? undefined : { revalidate: 300 },
    });
    if (response.status === 429) {
      throw new ExplorerClientError(
        "RATE_LIMITED",
        "Arcscan rate limit reached.",
        response.status,
      );
    }
    if (!response.ok) {
      throw new ExplorerClientError(
        "UNAVAILABLE",
        "Arcscan is temporarily unavailable.",
        response.status,
      );
    }
    const result = schema.safeParse(await response.json());
    if (!result.success) {
      throw new ExplorerClientError(
        "INVALID_RESPONSE",
        "Arcscan returned an unexpected response.",
      );
    }
    return result.data;
  } catch (error) {
    if (error instanceof ExplorerClientError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ExplorerClientError("TIMEOUT", "Arcscan request timed out.");
    }
    throw new ExplorerClientError(
      "UNAVAILABLE",
      "Arcscan is temporarily unavailable.",
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Loads a bounded first page from each public address endpoint. */
export async function getExplorerAddressData(
  address: string,
  limit: number,
  bypassCache = false,
): Promise<ExplorerAddressData> {
  const [summary, counters, transactions, tokenTransfers, tokenBalances] =
    await Promise.all([
      fetchExplorer(`addresses/${address}`, addressSchema, bypassCache),
      fetchExplorer(
        `addresses/${address}/counters`,
        addressCountersSchema,
        bypassCache,
      ),
      fetchExplorer(
        `addresses/${address}/transactions`,
        paginated(transactionSchema),
        bypassCache,
      ),
      fetchExplorer(
        `addresses/${address}/token-transfers?type=ERC-20`,
        paginated(tokenTransferSchema),
        bypassCache,
      ),
      fetchExplorer(
        `addresses/${address}/token-balances`,
        z.array(tokenBalanceSchema),
        bypassCache,
      ),
    ]);

  // Kept sequential to remain under Blockscout's five-request public burst limit.
  const internalTransactions = await fetchExplorer(
    `addresses/${address}/internal-transactions`,
    paginated(internalTransactionSchema),
    bypassCache,
  );

  return {
    address: summary,
    counters,
    transactions: transactions.items.slice(0, limit),
    tokenTransfers: tokenTransfers.items.slice(0, limit),
    internalTransactions: internalTransactions.items.slice(0, limit),
    tokenBalances: tokenBalances.slice(0, limit),
  };
}

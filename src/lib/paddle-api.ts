export function getPaddleApiBaseUrl(): string {
  const env = (process.env.PADDLE_ENV || "sandbox").toLowerCase();
  return env === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
}

export type PaddleApiKeyKind = "sandbox" | "live" | "missing" | "unknown";

export function getPaddleApiKeyKind(apiKey: string | undefined): PaddleApiKeyKind {
  if (!apiKey?.trim()) return "missing";
  if (apiKey.startsWith("pdl_sdbx_")) return "sandbox";
  if (apiKey.startsWith("pdl_live_")) return "live";
  return "unknown";
}

type PaddleTransactionPayload = {
  data?: {
    id?: string;
    status?: string;
    collection_mode?: string;
    checkout?: { url?: string | null } | null;
  };
  error?: { detail?: string; code?: string; message?: string };
  meta?: { request_id?: string };
};

export async function fetchPaddleTransaction(transactionId: string) {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) {
    return {
      ok: false as const,
      status: 0,
      payload: null as PaddleTransactionPayload | null,
      error: "missing_api_key" as const,
    };
  }

  const url = `${getPaddleApiBaseUrl()}/transactions/${encodeURIComponent(transactionId)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${paddleApiKey}` },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as PaddleTransactionPayload | null;
  return { ok: response.ok, status: response.status, payload, error: null };
}

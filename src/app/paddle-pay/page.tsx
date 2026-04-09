import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  fetchPaddleTransaction,
  getPaddleApiBaseUrl,
  getPaddleApiKeyKind,
} from "@/lib/paddle-api";
import { PaddlePayInitializer } from "./PaddlePayInitializer";

interface PaddlePayPageProps {
  searchParams: Promise<{
    _ptxn?: string;
  }>;
}

function paddleEnvTokenMismatchMessage(paddleEnv: string, clientToken: string): string | null {
  const env = paddleEnv.toLowerCase();
  const t = clientToken.trim();
  if (!t) return null;
  if (env === "sandbox" || env === "development" || !env) {
    if (!t.startsWith("test_")) {
      return "Server Paddle environment is sandbox, but the client token does not start with test_. Use a sandbox client-side token from your Paddle sandbox dashboard, or set PADDLE_ENV=live and a live_ token for production.";
    }
  }
  if (env === "live") {
    if (!t.startsWith("live_")) {
      return "PADDLE_ENV is live, but NEXT_PUBLIC_PADDLE_CLIENT_TOKEN must be a live_ token from the live Paddle dashboard. Sandbox test_ tokens cannot open checkouts for live transactions.";
    }
  }
  return null;
}

function paddleApiKeyEnvMismatchMessage(paddleEnv: string, apiKeyKind: ReturnType<typeof getPaddleApiKeyKind>): string | null {
  const env = paddleEnv.toLowerCase();
  if (apiKeyKind === "missing") {
    return "PADDLE_API_KEY is not set on the server. Checkout cannot be validated.";
  }
  if (apiKeyKind === "unknown") return null;
  if (env === "live" && apiKeyKind === "sandbox") {
    return "PADDLE_ENV is live but your API key is a sandbox key (starts with pdl_sdbx_). The server is calling https://api.paddle.com while your key is for sandbox — fix Vercel: set PADDLE_ENV=sandbox and use sandbox client token, or switch to a live API key and live_ client token.";
  }
  if ((env === "sandbox" || env === "development" || !env) && apiKeyKind === "live") {
    return "PADDLE_ENV is sandbox but your API key looks like a live key (pdl_live_). The server calls sandbox-api while transactions may not match your client token — align PADDLE_ENV, API key, and NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to the same Paddle workspace (sandbox or live).";
  }
  return null;
}

export default async function PaddlePayPage({ searchParams }: PaddlePayPageProps) {
  const params = await searchParams;
  const transactionId = params?._ptxn;
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
  const paddleEnv = (process.env.PADDLE_ENV || "sandbox").toLowerCase();
  const apiKeyKind = getPaddleApiKeyKind(process.env.PADDLE_API_KEY);
  const envMismatch = paddleClientToken ? paddleEnvTokenMismatchMessage(paddleEnv, paddleClientToken) : null;
  const keyEnvMismatch = paddleApiKeyEnvMismatchMessage(paddleEnv, apiKeyKind);

  let txnStatus: string | null = null;
  let txnCollectionMode: string | null = null;
  let checkoutUrlFromApi: string | null = null;
  let txnLookupMessage: string | null = null;
  let paddleRequestId: string | null = null;

  if (transactionId && apiKeyKind !== "missing") {
    const txn = await fetchPaddleTransaction(transactionId);
    paddleRequestId = txn.payload?.meta?.request_id ?? null;

    if (txn.error === "missing_api_key") {
      txnLookupMessage = "Cannot look up this transaction (missing server API key).";
    } else if (!txn.ok) {
      const detail =
        txn.payload?.error?.detail ||
        txn.payload?.error?.message ||
        (txn.status === 404 ? "Transaction not found in this Paddle environment." : null);
      txnLookupMessage =
        detail ||
        `Could not load transaction from Paddle (HTTP ${txn.status}). Check PADDLE_ENV and PADDLE_API_KEY match the environment where this payment link was created.`;
    } else {
      const data = txn.payload?.data;
      txnStatus = data?.status ?? null;
      txnCollectionMode = data?.collection_mode ?? null;
      checkoutUrlFromApi = data?.checkout?.url ?? null;

      if (!checkoutUrlFromApi) {
        txnLookupMessage =
          "Paddle returned no checkout URL for this transaction. It may be manual collection without checkout enabled, canceled, or not payable online. Create a new payment link from the admin panel.";
      } else {
        const h = await headers();
        const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]?.trim();
        try {
          const canonical = new URL(checkoutUrlFromApi);
          if (host && canonical.host !== host) {
            redirect(checkoutUrlFromApi);
          }
        } catch {
          /* ignore invalid checkout URL */
        }
      }
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold mb-3">Secure Payment</h1>
        {transactionId ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Preparing checkout for <span className="font-mono text-foreground">{transactionId}</span>. The payment
              window may open on its own; if not, use the button below.
            </p>
            {keyEnvMismatch ? (
              <p className="text-red-600 border border-red-500/30 rounded-md p-3 text-sm">{keyEnvMismatch}</p>
            ) : null}
            {txnLookupMessage ? (
              <p className="text-amber-800 dark:text-amber-400 border border-amber-500/30 rounded-md p-3 text-sm">
                {txnLookupMessage}
              </p>
            ) : null}
            {!txnLookupMessage && txnStatus ? (
              <p className="text-xs text-muted-foreground">
                Paddle: status <span className="font-mono">{txnStatus}</span>
                {txnCollectionMode ? (
                  <>
                    {" "}
                    · collection <span className="font-mono">{txnCollectionMode}</span>
                  </>
                ) : null}
                {checkoutUrlFromApi ? (
                  <>
                    {" "}
                    · API base <span className="font-mono">{getPaddleApiBaseUrl().replace(/^https:\/\//, "")}</span>
                  </>
                ) : null}
              </p>
            ) : null}
            {paddleRequestId ? (
              <p className="text-xs text-muted-foreground">
                Paddle request_id: <span className="font-mono">{paddleRequestId}</span>
              </p>
            ) : null}
            {!paddleClientToken ? (
              <p className="text-red-600">
                Missing <span className="font-mono">NEXT_PUBLIC_PADDLE_CLIENT_TOKEN</span> in environment.
              </p>
            ) : (
              <PaddlePayInitializer token={paddleClientToken} transactionId={transactionId} />
            )}
            {envMismatch ? (
              <p className="text-amber-700 dark:text-amber-500 text-sm border border-amber-500/30 rounded-md p-3 mt-2">
                {envMismatch}
              </p>
            ) : null}
            {!keyEnvMismatch && !envMismatch && !txnLookupMessage ? (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border mt-3">
                If the browser shows <span className="font-mono">403</span> on{" "}
                <span className="font-mono">checkout-service.paddle.com</span>, your{" "}
                <span className="font-mono">NEXT_PUBLIC_PADDLE_CLIENT_TOKEN</span> is almost always from a different
                Paddle account than <span className="font-mono">PADDLE_API_KEY</span>. Create a new client-side token in
                the same Paddle workspace (sandbox vs live) as the API key and redeploy.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-red-600">
            Missing transaction ID. Please use a valid payment link.
          </p>
        )}
      </div>
    </div>
  );
}

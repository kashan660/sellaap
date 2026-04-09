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

export default async function PaddlePayPage({ searchParams }: PaddlePayPageProps) {
  const params = await searchParams;
  const transactionId = params?._ptxn;
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
  const paddleEnv = (process.env.PADDLE_ENV || "sandbox").toLowerCase();
  const envMismatch = paddleClientToken ? paddleEnvTokenMismatchMessage(paddleEnv, paddleClientToken) : null;

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

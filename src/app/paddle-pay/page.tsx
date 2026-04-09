import Script from "next/script";

interface PaddlePayPageProps {
  searchParams: Promise<{
    _ptxn?: string;
  }>;
}

export default async function PaddlePayPage({ searchParams }: PaddlePayPageProps) {
  const params = await searchParams;
  const transactionId = params?._ptxn;
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
  const paddleEnv = (process.env.NEXT_PUBLIC_PADDLE_ENV || process.env.PADDLE_ENV || "sandbox").toLowerCase();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
      {transactionId ? (
        <Script id="paddle-pay-open" strategy="afterInteractive">
          {`
            (function openPaddleCheckout() {
              var txn = ${JSON.stringify(transactionId)};
              var token = ${JSON.stringify(paddleClientToken)};
              var env = ${JSON.stringify(paddleEnv)};
              var attempts = 0;

              function run() {
                attempts += 1;
                if (!window.Paddle) {
                  if (attempts < 60) setTimeout(run, 150);
                  return;
                }

                try {
                  if (env === 'sandbox' && window.Paddle.Environment && typeof window.Paddle.Environment.set === 'function') {
                    window.Paddle.Environment.set('sandbox');
                  }

                  if (!token) {
                    console.error('Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN for Paddle.js checkout open.');
                    return;
                  }

                  if (typeof window.Paddle.Initialize === 'function') {
                    window.Paddle.Initialize({ token: token });
                  }

                  if (window.Paddle.Checkout && typeof window.Paddle.Checkout.open === 'function') {
                    window.Paddle.Checkout.open({ transactionId: txn });
                  }
                } catch (e) {
                  console.error('Failed to open Paddle checkout', e);
                }
              }

              run();
            })();
          `}
        </Script>
      ) : null}
      <div className="max-w-xl w-full rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold mb-3">Secure Payment</h1>
        {transactionId ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Checkout is opening for transaction <span className="font-mono">{transactionId}</span>.
            </p>
            <p>If it does not open automatically, refresh this page once.</p>
            {!paddleClientToken ? (
              <p className="text-red-600">
                Missing <span className="font-mono">NEXT_PUBLIC_PADDLE_CLIENT_TOKEN</span> in environment.
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

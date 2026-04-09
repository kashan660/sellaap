import Script from "next/script";

interface PaddlePayPageProps {
  searchParams: Promise<{
    _ptxn?: string;
  }>;
}

export default async function PaddlePayPage({ searchParams }: PaddlePayPageProps) {
  const params = await searchParams;
  const transactionId = params?._ptxn;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
      <div className="max-w-xl w-full rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold mb-3">Secure Payment</h1>
        {transactionId ? (
          <p className="text-sm text-muted-foreground">
            Checkout is opening for transaction <span className="font-mono">{transactionId}</span>.
            If it does not open automatically, refresh this page once.
          </p>
        ) : (
          <p className="text-sm text-red-600">
            Missing transaction ID. Please use a valid payment link.
          </p>
        )}
      </div>
    </div>
  );
}

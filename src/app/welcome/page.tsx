import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Welcome to Sellaap+ - Sellaap",
};

export default function WelcomePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="h-14 w-14 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Welcome to Sellaap+</h1>
        <p className="text-muted-foreground mb-8">
          Your membership is active. Your discount will apply automatically at checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

'use client';

import { registerUser } from "@/lib/actions/auth";
import { useActionState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  error: "",
  success: false,
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/auth/signin?registered=true");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        {state?.error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number (Optional)</label>
            <input
              name="mobile"
              type="tel"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

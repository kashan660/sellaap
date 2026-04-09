"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: {
        token: string;
        checkout?: { settings: Record<string, unknown> };
      }) => void;
      Checkout?: {
        open: (opts: {
          transactionId: string;
          settings?: Record<string, unknown>;
        }) => void;
      };
    };
  }
}

const PADDLE_SCRIPT_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

const overlaySettings = {
  displayMode: "overlay" as const,
  theme: "light" as const,
  locale: "en" as const,
};

export function PaddlePayInitializer({
  token,
  transactionId,
}: {
  token: string;
  transactionId: string;
}) {
  const initialized = useRef(false);
  const [paddleReady, setPaddleReady] = useState(false);

  const openTransactionCheckout = useCallback(() => {
    const Paddle = window.Paddle;
    if (!Paddle?.Checkout?.open) {
      console.error("Paddle.Checkout.open is not available yet.");
      return;
    }
    try {
      Paddle.Checkout.open({
        transactionId,
        settings: { ...overlaySettings },
      });
    } catch (e) {
      console.error("Paddle.Checkout.open failed:", e);
    }
  }, [transactionId]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const initOnce = () => {
      if (cancelled || initialized.current || typeof window === "undefined") return false;
      const Paddle = window.Paddle;
      if (!Paddle?.Initialize) return false;
      try {
        Paddle.Initialize({
          token,
          checkout: {
            settings: { ...overlaySettings },
          },
        });
        initialized.current = true;
        setPaddleReady(true);
        return true;
      } catch (e) {
        console.error("Paddle.Initialize failed:", e);
        return false;
      }
    };

    if (initOnce()) {
      return () => {
        cancelled = true;
      };
    }

    const startPolling = () => {
      let attempts = 0;
      const id = window.setInterval(() => {
        if (cancelled) {
          window.clearInterval(id);
          return;
        }
        attempts += 1;
        if (initOnce() || attempts >= 80) window.clearInterval(id);
      }, 100);
    };

    const existing = document.querySelector(`script[src="${PADDLE_SCRIPT_SRC}"]`);
    if (existing) {
      startPolling();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = PADDLE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => startPolling();
    script.onerror = () => console.error("Failed to load Paddle.js");
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button type="button" variant="default" disabled={!paddleReady} onClick={openTransactionCheckout}>
        Open secure checkout
      </Button>
      <span className="text-xs text-muted-foreground">
        Use if the payment window does not appear after a few seconds.
      </span>
    </div>
  );
}

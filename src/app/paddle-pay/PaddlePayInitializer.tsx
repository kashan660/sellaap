"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: {
        token: string;
        checkout?: { settings: Record<string, string> };
      }) => void;
    };
  }
}

const PADDLE_SCRIPT_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

export function PaddlePayInitializer({ token }: { token: string }) {
  const initialized = useRef(false);

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
            settings: {
              displayMode: "overlay",
              theme: "light",
              locale: "en",
            },
          },
        });
        initialized.current = true;
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

  return null;
}

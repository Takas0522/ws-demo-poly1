"use client";

import { queryClient } from "@/lib/react-query-client";
import { initializeTelemetry } from "@/lib/telemetry";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // クライアントサイドの Application Insights を初期化（未構築時は何もしない）
  useEffect(() => {
    initializeTelemetry().catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

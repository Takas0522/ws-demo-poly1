"use client";

/**
 * ルートレイアウトレベルのエラーバウンダリ（集約例外パターン）
 *
 * ルートレイアウト (`layout.tsx`) 内で発生したエラーをキャッチし、
 * Application Insights に送信します。
 * エラーはコンソールにも出力されるため、ローカル開発でも確認可能です。
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-global-errors
 */

import { initializeTelemetry, trackException } from "@/lib/telemetry";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ローカル開発でも確認できるようコンソールに出力
    console.error("[GlobalError]", error);

    // Application Insights にエラーを送信（未構築時は何もしない）
    initializeTelemetry()
      .then(() => trackException(error))
      .catch(() => {});
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "sans-serif",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            予期しないエラーが発生しました
          </h1>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            申し訳ございません。アプリケーションでエラーが発生しました。
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "8px",
                maxWidth: "600px",
                overflow: "auto",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              {error.message}
              {"\n"}
              {error.stack}
            </pre>
          )}
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}

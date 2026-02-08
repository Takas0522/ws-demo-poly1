"use client";

/**
 * ルートレベルのエラーバウンダリ（集約例外パターン）
 *
 * 各ページ/レイアウトで発生したレンダリングエラーをキャッチし、
 * Application Insights に送信します。
 * エラーはコンソールにも出力されるため、ローカル開発でも確認可能です。
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

import { initializeTelemetry, trackException } from "@/lib/telemetry";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ローカル開発でも確認できるようコンソールに出力
    console.error("[Error]", error);

    // Application Insights にエラーを送信（未構築時は何もしない）
    initializeTelemetry()
      .then(() => trackException(error))
      .catch(() => {});
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        エラーが発生しました
      </h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        ページの読み込み中にエラーが発生しました。
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
  );
}

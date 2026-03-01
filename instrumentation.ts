/**
 * Next.js Instrumentation Hook
 *
 * サーバーサイドの Application Insights テレメトリを初期化し、
 * リクエストエラーを集約的に Application Insights に送信します。
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import type { Instrumentation } from "next";

/**
 * サーバー起動時に Application Insights を初期化します。
 * Node.js ランタイムでのみ実行されます。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
      console.info(
        "[Telemetry] APPLICATIONINSIGHTS_CONNECTION_STRING が未設定のため、" +
          "サーバーサイド Application Insights は無効です",
      );
      return;
    }

    try {
      // applicationinsights は APPLICATIONINSIGHTS_CONNECTION_STRING 環境変数を自動検出するため
      // setup() に引数は不要
      const appInsights = await import("applicationinsights");
      appInsights
        .setup()
        .setAutoCollectExceptions(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, false)
        .setAutoCollectDependencies(true)
        .start();

      appInsights.defaultClient.context.tags[
        appInsights.defaultClient.context.keys.cloudRole
      ] = "frontend";

      console.info(
        "[Telemetry] サーバーサイド Application Insights を初期化しました",
      );
    } catch (error) {
      console.warn(
        "[Telemetry] サーバーサイド Application Insights の初期化に失敗しました:",
        error,
      );
    }
  }
}

/**
 * サーバーサイドのリクエストエラーを集約的に処理します（集約例外パターン）。
 *
 * - Application Insights にエラーを送信
 * - コンソールにもエラーを出力（ローカル開発でも確認可能）
 * - 例外を握りつぶさない
 * - Application Insights が未構築（環境変数未設定）でもエラーなく動作
 */
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  // ローカル開発でもエラーを確認できるようコンソールに出力
  console.error(
    `[RequestError] ${request.method} ${request.path} (${context.routeType}):`,
    err,
  );

  // Application Insights への送信（環境変数が設定されている場合のみ）
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  ) {
    try {
      const appInsights = await import("applicationinsights");
      const client = appInsights.defaultClient;

      if (client) {
        client.trackException({
          exception: err instanceof Error ? err : new Error(String(err)),
          properties: {
            method: request.method,
            path: request.path,
            routerKind: context.routerKind,
            routePath: context.routePath,
            routeType: context.routeType,
          },
        });
      }
    } catch {
      // Application Insights が未初期化またはパッケージ未インストールの場合は無視
    }
  }
};

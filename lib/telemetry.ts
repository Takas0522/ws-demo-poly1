/**
 * Application Insights クライアントサイドテレメトリモジュール
 *
 * ブラウザ側のエラーを Application Insights に送信します。
 * NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING が設定されている場合のみ有効です。
 *
 * Application Insights が未構築（環境変数未設定）の場合でも
 * アプリケーションは正常に動作し、App Insights 関連のエラーは発生しません。
 */

// ApplicationInsights の型参照（動的 import で実体をロードするため型のみ）
type ApplicationInsightsInstance = InstanceType<
  typeof import("@microsoft/applicationinsights-web").ApplicationInsights
>;

let appInsights: ApplicationInsightsInstance | null = null;
let _initialized = false;

/**
 * クライアントサイドの Application Insights を初期化します。
 * 複数回呼ばれても安全です（シングルトン）。
 *
 * 環境変数が未設定の場合は何もせず null を返します。
 * SDK のロードに失敗しても例外は発生しません。
 */
export async function initializeTelemetry(): Promise<ApplicationInsightsInstance | null> {
  if (typeof window === "undefined") return null;
  if (_initialized) return appInsights;
  _initialized = true;

  const connectionString =
    process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString) {
    return null;
  }

  try {
    const { ApplicationInsights } =
      await import("@microsoft/applicationinsights-web");
    appInsights = new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
        enableUnhandledPromiseRejectionTracking: true,
        enableAjaxErrorStatusText: true,
      },
    });
    appInsights.loadAppInsights();
    console.info("[Telemetry] Application Insights を初期化しました");
    return appInsights;
  } catch (error) {
    console.warn(
      "[Telemetry] Application Insights の初期化に失敗しました:",
      error,
    );
    appInsights = null;
    return null;
  }
}

/**
 * 例外を Application Insights に送信します。
 * Application Insights が未初期化の場合は何もしません。
 * 送信に失敗してもアプリケーション側にエラーは伝播しません。
 */
export function trackException(error: Error, severityLevel?: number): void {
  if (!appInsights) return;

  try {
    appInsights.trackException({
      exception: error,
      severityLevel,
    });
  } catch {
    // Application Insights への送信失敗はアプリケーションに影響させない
  }
}

/**
 * Application Insights インスタンスを取得します。
 */
export function getAppInsights(): ApplicationInsightsInstance | null {
  return appInsights;
}

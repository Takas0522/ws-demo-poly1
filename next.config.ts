import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // applicationinsights は内部で mysql/pg 等のネイティブモジュールを
  // 動的に require するため、webpack バンドル対象から除外する
  serverExternalPackages: [
    "applicationinsights",
    "diagnostic-channel",
    "diagnostic-channel-publishers",
  ],
};

export default nextConfig;

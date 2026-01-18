import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      // Auth Service - 認証サービス
      "/api/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      // User Management Service - ユーザー管理サービス
      // Note: このパターンは /api/v1/users と /api/tenants の両方をカバーする
      "/api/v1/users": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      "/api/v1/tenants": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      "/api/tenants": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      // Service Settings Service - サービス設定サービス
      "/api/services": {
        target: "http://localhost:3003",
        changeOrigin: true,
        secure: false,
      },
      "/api/configurations": {
        target: "http://localhost:3003",
        changeOrigin: true,
        secure: false,
      },
      "/api/analytics": {
        target: "http://localhost:3003",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

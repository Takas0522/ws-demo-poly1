"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Management Application
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-zinc-100 dark:bg-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">ダッシュボード</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              ようこそ、{user?.name}さん
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                テナント管理
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                テナントの一覧表示・編集
              </p>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  詳細を見る →
                </a>
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                ユーザー管理
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                ユーザーの一覧表示・編集
              </p>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  詳細を見る →
                </a>
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                サービス設定
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">サービス割当の管理</p>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  詳細を見る →
                </a>
              </div>
            </div>
          </div>

          {user && user.tenants && user.tenants.length > 0 && (
            <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                所属テナント
              </h3>
              <div className="space-y-2">
                {user.tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between rounded-md bg-zinc-50 dark:bg-zinc-700 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {tenant.name}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{tenant.id}</p>
                    </div>
                    {tenant.isPrivileged && (
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                        特権テナント
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

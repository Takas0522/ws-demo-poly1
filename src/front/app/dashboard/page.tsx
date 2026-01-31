"use client";

import { useAuth, canAccessMenu } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">ダッシュボード</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            ようこそ、{user?.name}さん
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {canAccessMenu(user, "tenant-management") && (
            <Link href="/tenants">
              <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  テナント管理
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  テナントの一覧表示・編集
                </p>
                <div className="mt-4">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    詳細を見る →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {canAccessMenu(user, "user-management") && (
            <Link href="/users">
              <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  ユーザー管理
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  ユーザーの一覧表示・編集
                </p>
                <div className="mt-4">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    詳細を見る →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {canAccessMenu(user, "service-settings") && (
            <Link href="/service-settings">
              <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  サービス設定
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">サービス割当の管理</p>
                <div className="mt-4">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    詳細を見る →
                  </span>
                </div>
              </div>
            </Link>
          )}
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
    </DashboardLayout>
  );
}

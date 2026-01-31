"use client";

import { useAuth, canAccessMenu } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout";
import { DashboardCard } from "@/components/DashboardCard";

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
            <DashboardCard
              title="テナント管理"
              description="テナントの一覧表示・編集"
              href="/tenants"
              icon="🏢"
            />
          )}

          {canAccessMenu(user, "user-management") && (
            <DashboardCard
              title="ユーザー管理"
              description="ユーザーの一覧表示・編集"
              href="/users"
              icon="👥"
            />
          )}

          {canAccessMenu(user, "service-settings") && (
            <DashboardCard
              title="サービス設定"
              description="サービス割当の管理"
              href="/service-settings"
              icon="⚙️"
            />
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

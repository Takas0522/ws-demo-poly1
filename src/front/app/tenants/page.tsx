"use client";

import { DashboardLayout } from "@/components/layout";

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">テナント管理</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">テナントの一覧表示・編集</p>
        </div>

        <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow">
          <p className="text-zinc-600 dark:text-zinc-400">テナント管理画面（実装予定）</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

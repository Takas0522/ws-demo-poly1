'use client';

import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [errorResult, setErrorResult] = useState<string | null>(null);
  const [isErrorLoading, setIsErrorLoading] = useState(false);

  const handleTriggerError = async () => {
    setIsErrorLoading(true);
    setErrorResult(null);
    try {
      const response = await fetch('/api/debug/error500');
      const data = await response.json();
      if (!response.ok) {
        setErrorResult(`エラー発生 (HTTP ${response.status}): ${JSON.stringify(data)}`);
      } else {
        setErrorResult(`レスポンス: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setErrorResult(`例外発生: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsErrorLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">ダッシュボード</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            ようこそ、{user?.user_id} さん
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">テナントID: {user?.tenant_id}</p>
            <p className="text-gray-700 font-semibold">ロール:</p>
            <ul className="list-disc list-inside ml-4 text-gray-600">
              {user?.roles.map((role, index) => (
                <li key={index}>
                  {role.service_name}: {role.role_name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">デバッグ</h2>
          <p className="text-sm text-gray-500 mb-4">
            テナント管理サービスに対して意図的に500エラーを発生させます。
          </p>
          <button
            onClick={handleTriggerError}
            disabled={isErrorLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isErrorLoading ? '送信中...' : '500エラーを発生させる'}
          </button>
          {errorResult && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm font-mono text-gray-800 break-all">
              {errorResult}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

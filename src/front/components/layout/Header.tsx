"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to login page even if logout fails
      router.push("/login");
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Management Application
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-zinc-100 dark:bg-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}

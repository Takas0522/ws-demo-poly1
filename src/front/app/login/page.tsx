"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, AUTH_ERROR_MESSAGES } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!loginId.trim() || !password.trim()) {
      setError(AUTH_ERROR_MESSAGES.AUTH001);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(loginId, password);
      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (err: unknown) {
      // Handle authentication errors
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        typeof err.code === "string"
      ) {
        const errorCode = err.code;
        setError(
          AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.AUTH002,
        );
      } else {
        setError(AUTH_ERROR_MESSAGES.AUTH002);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Management Application
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            特権テナント所属ユーザーのみログイン可能です
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-lg bg-white dark:bg-zinc-800 p-8 shadow-md"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                ログインID
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                autoComplete="username"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}

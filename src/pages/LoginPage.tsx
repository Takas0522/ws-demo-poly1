import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";

/**
 * Login Page Component
 *
 * Provides a login form with email and password inputs.
 * Handles authentication and displays error messages for external users.
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get the redirect path from location state (set by ProtectedRoute)
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    try {
      await login({ email, password });
      // Redirect to original location or home page on successful login
      navigate(from, { replace: true });
    } catch (err: any) {
      // Handle specific error for external users
      if (err.message?.includes("external")) {
        setError("外部ユーザーはこのインターフェースからログインできません");
      } else if (err.response?.status === 401) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        setError("ログインに失敗しました。もう一度お試しください");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ログイン</h1>
            <p className="text-gray-600">アカウントにログインしてください</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <span>ログイン中...</span>
                  </span>
                ) : (
                  "ログイン"
                )}
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              パスワードをお忘れの場合は、管理者にお問い合わせください
            </p>
          </div>
        </div>

        {/* Development Credentials */}
        {import.meta.env.DEV && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🔧 開発用アカウント
            </h3>
            <div className="space-y-2 text-xs text-blue-800">
              <div className="flex justify-between items-center">
                <span className="font-medium">管理者:</span>
                <span className="font-mono">admin@company.com / Admin@123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">マネージャー:</span>
                <span className="font-mono">
                  manager@company.com / Manager@123
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">一般ユーザー:</span>
                <span className="font-mono">user@example.com / User@123</span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>アカウントをお持ちでない場合は、管理者にお問い合わせください</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

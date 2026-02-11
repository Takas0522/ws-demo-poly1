# フロントエンド（BFF） コンポーネント設計

## ドキュメント情報

- **バージョン**: 1.0.0
- **最終更新日**: 2024年
- **ステータス**: Draft

---

## 1. 概要

Next.js（App Router）ベースのフロントエンドアプリケーション。BFF（Backend For Frontend）パターンを採用し、Server Actionsを通じてバックエンドサービスと通信します。

## 2. ディレクトリ構造

```
src/front/
├── app/                        # App Router
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # ホームページ
│   ├── globals.css
│   ├── login/                  # ログインページ
│   │   └── page.tsx
│   ├── dashboard/              # ダッシュボード
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tenants/            # テナント管理
│   │   ├── services/           # サービス管理
│   │   └── users/              # ユーザー管理
│   ├── api/                    # BFF APIルート
│   │   └── v1/
│   │       ├── auth/
│   │       ├── tenants/
│   │       └── services/
│   └── actions/                # Server Actions
│       ├── auth.ts
│       ├── tenants.ts
│       └── services.ts
├── components/                 # 共通コンポーネント
│   ├── ui/                     # UIコンポーネント
│   ├── layout/                 # レイアウト
│   └── features/               # 機能コンポーネント
├── hooks/                      # カスタムフック
├── lib/                        # ユーティリティ
│   ├── api-client.ts           # バックエンドAPI通信
│   └── auth.ts                 # 認証ユーティリティ
├── types/                      # 型定義
├── tests/                      # テスト
├── infra/                      # IaC定義
│   ├── app-service.bicep
│   └── app-service-plan.bicep
├── middleware.ts                # 認証ミドルウェア
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 3. BFF APIルート設計

### 3.1 概要

Next.js API Routes を使用したBFFレイヤーです。クライアントからのリクエストを受け、バックエンドサービスに転送します。

### 3.2 BFF API一覧

| BFF API                     | バックエンドサービス      | 説明                 |
| --------------------------- | ------------------------- | -------------------- |
| `/api/v1/auth/login`        | Auth Service              | ログイン             |
| `/api/v1/auth/me`           | Auth Service              | 自分の情報取得       |
| `/api/v1/tenants`           | Tenant Management Service | テナント管理         |
| `/api/v1/tenants/:id/users` | Tenant Management Service | テナントユーザー管理 |
| `/api/v1/services`          | Service Setting Service   | サービス管理         |
| `/api/v1/services/assign`   | Service Setting Service   | サービス割り当て     |

### 3.3 BFF通信パターン

```typescript
// lib/api-client.ts
class BackendApiClient {
  private async request<T>(
    service: "auth" | "tenant" | "service-setting",
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const baseUrl = this.getServiceUrl(service);
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }

    return response.json();
  }
}
```

## 4. コンポーネント設計

### 4.1 レイアウト構造

```
RootLayout
├── LoginPage（未認証）
└── DashboardLayout（認証済み）
    ├── Sidebar
    ├── Header（ユーザー情報表示）
    └── MainContent
        ├── DashboardPage
        ├── TenantsPage
        │   ├── TenantList
        │   └── TenantDetail
        ├── ServicesPage
        │   ├── ServiceList
        │   └── ServiceDetail
        └── UsersPage
            ├── UserList
            └── UserDetail
```

### 4.2 認証フロー

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
```

## 5. Mockサービス

開発時やテスト時にバックエンドサービスなしでフロントエンドを動作させるためのモックモードです。

### 5.1 Mockデータ

```typescript
// mock/data.ts
export const mockTenants: Tenant[] = [
  {
    id: "tenant-001",
    tenant_name: "privileged-tenant",
    display_name: "特権テナント",
    is_active: true,
    is_privileged: true,
  },
  // ...
];
```

### 5.2 Mock API Route

```typescript
// app/api/mock/tenants/route.ts
export async function GET() {
  return NextResponse.json({
    items: mockTenants,
    total: mockTenants.length,
    page: 1,
    per_page: 20,
  });
}
```

## 6. 環境変数

```bash
# Backend Service URLs
AUTH_SERVICE_URL=http://auth-service:8001
TENANT_SERVICE_URL=http://tenant-management-service:8002
SERVICE_SETTING_URL=http://service-setting-service:8003

# Auth
NEXTAUTH_SECRET=your-secret

# App
NEXT_PUBLIC_APP_NAME=SaaS Management Console
PORT=3000

# Mock Mode
USE_MOCK=false
```

---

## 変更履歴

| バージョン | 日付 | 変更内容                                   | 作成者             |
| ---------- | ---- | ------------------------------------------ | ------------------ |
| 1.0.0      | 2024 | 初版作成（統合コンポーネント設計から分離） | Architecture Agent |

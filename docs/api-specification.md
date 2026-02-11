# Frontend (BFF) API 仕様書

## ドキュメント情報

- **バージョン**: 1.0.0
- **最終更新日**: 2024年
- **ステータス**: Draft
- **共通仕様**: [共通API仕様](../../docs/arch/api/api-specification.md) を参照

---

## 概要

**ベースURL**: `http://localhost:3000/api`

BFFはバックエンドサービスのプロキシとして機能し、データを集約して返却します。

---

## 1. 認証関連

### 1.1 ログイン

```http
POST /api/auth/login
```

**リクエスト**:

```json
{
  "user_id": "admin@example.com",
  "password": "password123"
}
```

**レスポンス** (200):

- Cookie に JWT を設定
- レスポンスボディは認証サービスと同様

**処理フロー**:

1. 認証サービスの `/auth/login` を呼び出し
2. JWT を Cookie に設定（httpOnly, secure）
3. ユーザー情報を返却

### 1.2 ログアウト

```http
POST /api/auth/logout
```

**レスポンス** (200):

```json
{
  "message": "Logged out successfully"
}
```

**処理**: Cookie をクリア

### 1.3 現在のユーザー情報

```http
GET /api/auth/me
```

**レスポンス**: 認証サービスと同様

---

## 2. テナント管理

エンドポイントは基本的にバックエンドサービスと同じですが、BFFでデータを集約します。

### 2.1 テナント詳細取得（データ集約版）

```http
GET /api/tenants/{tenant_id}
```

**レスポンス** (200):

```json
{
  "id": "tenant-uuid",
  "name": "株式会社サンプル",
  "domains": ["example.com"],
  "is_privileged": false,
  "created_at": "2024-01-15T10:00:00Z",
  "users": [
    {
      "id": "user-uuid",
      "user_id": "user@example.com",
      "name": "山田太郎",
      "roles": [
        {
          "service_name": "テナント管理サービス",
          "role_name": "管理者"
        }
      ]
    }
  ],
  "services": [
    {
      "id": "service-uuid",
      "name": "ファイル管理サービス",
      "assigned_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**処理フロー**:

1. テナント管理サービスでテナント情報取得
2. 認証サービスでユーザー詳細とロール取得
3. サービス設定サービスでサービス一覧取得
4. データを集約してレスポンス

---

## 3. モックサービス API

BFF内に実装されたモックサービスのAPIです。

### 3.1 ファイル管理サービス

```http
GET /api/mock/file-management/files
Authorization: Bearer {token}
```

**レスポンス** (200):

```json
{
  "files": [
    {
      "id": "file-1",
      "name": "document.pdf",
      "size": 1024000,
      "mime_type": "application/pdf",
      "uploaded_at": "2024-01-15T10:30:00Z",
      "uploaded_by": "user-1",
      "uploaded_by_name": "山田太郎"
    }
  ]
}
```

### 3.2 メッセージングサービス

```http
GET /api/mock/messaging/messages
Authorization: Bearer {token}
```

**レスポンス** (200):

```json
{
  "messages": [
    {
      "id": "msg-1",
      "subject": "System Update",
      "body": "The system will be updated tonight.",
      "sent_at": "2024-01-15T10:00:00Z",
      "sent_by": "admin-1",
      "sent_by_name": "システム管理者",
      "read": false
    }
  ]
}
```

### 3.3 API利用サービス

```http
GET /api/mock/api-usage/status
Authorization: Bearer {token}
```

**レスポンス** (200):

```json
{
  "tenant_id": "tenant-uuid",
  "total_requests": 15000,
  "remaining_quota": 35000,
  "quota_limit": 50000,
  "reset_date": "2024-02-01T00:00:00Z",
  "current_period": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-02-01T00:00:00Z"
  }
}
```

### 3.4 バックアップサービス

```http
GET /api/mock/backup/backups
Authorization: Bearer {token}
```

**レスポンス** (200):

```json
{
  "backups": [
    {
      "id": "backup-1",
      "created_at": "2024-01-15T02:00:00Z",
      "size": 5120000,
      "status": "completed",
      "retention_until": "2024-02-15T02:00:00Z"
    }
  ]
}
```

```http
POST /api/mock/backup/execute
Authorization: Bearer {token}
```

**必要ロール**: 管理者

**レスポンス** (201):

```json
{
  "id": "backup-2",
  "status": "in_progress",
  "started_at": "2024-01-25T10:00:00Z"
}
```

---

## 変更履歴

| バージョン | 日付 | 変更内容                                | 作成者             |
| ---------- | ---- | --------------------------------------- | ------------------ |
| 1.0.0      | 2024 | 初版作成（統合APIドキュメントから分離） | Architecture Agent |

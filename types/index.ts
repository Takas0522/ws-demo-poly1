export interface User {
  id: string;
  userId: string;
  name: string;
  tenantId: string;
  roles: Role[];
}

export interface Role {
  id: string;
  serviceId: string;
  serviceName: string;
  roleCode: string;
  roleName: string;
  description: string;
}

export interface Tenant {
  id: string;
  name: string;
  domains: string[];
  isPrivileged: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  apiUrl: string;
  isActive: boolean;
}

export interface TenantService {
  tenantId: string;
  serviceId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

/** サービス機能マスター */
export interface ServiceFeature {
  id: string;
  service_id: string;
  feature_key: string;
  feature_name: string;
  description: string;
  default_enabled: boolean;
  created_at: string;
}

/** テナント別機能設定（マスターとマージ済みレスポンス） */
export interface TenantServiceFeature {
  feature_id: string;
  service_id: string;
  feature_key: string;
  feature_name: string;
  description: string;
  is_enabled: boolean;
  is_default: boolean;
  updated_at: string | null;
  updated_by: string | null;
}

/**
 * User management types
 */

export type UserType = 'internal' | 'external';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserTenantAssignment {
  tenantId: string;
  tenantName: string;
  roles: string[];
  permissions: string[];
  isPrimary: boolean;
}

export interface UserListItem {
  id: string;
  username: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  tenants: {
    id: string;
    name: string;
  }[];
  createdAt: string;
}

export interface UserDetail {
  id: string;
  username: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  tenantAssignments: UserTenantAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  userType: UserType;
  primaryTenantId?: string;
  status?: UserStatus;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  userType?: UserType;
  status?: UserStatus;
}

export interface UserListParams {
  page?: number;
  perPage?: number;
  search?: string;
  userType?: UserType;
  status?: UserStatus;
  tenantId?: string;
}

export interface UserListResponse {
  items: UserListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TenantAssignmentInput {
  tenantId: string;
  roles: string[];
  permissions?: string[];
}

export interface EmailValidationResult {
  valid: boolean;
  message?: string;
  suggestedUserType?: UserType;
}

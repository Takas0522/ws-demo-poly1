import apiClient from "./apiClient";
import {
  UserDetail,
  UserListResponse,
  UserCreateInput,
  UserUpdateInput,
  UserListParams,
  TenantAssignmentInput,
  EmailValidationResult,
} from "../types/user";

/**
 * User API Client
 * Provides methods for user management operations
 */

/**
 * Get paginated list of users
 */
export const getUsers = async (
  params: UserListParams = {}
): Promise<UserListResponse> => {
  const response = await apiClient.get<UserListResponse>("/api/v1/users", {
    params,
  });
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<UserDetail> => {
  const response = await apiClient.get<UserDetail>(`/api/v1/users/${id}`);
  return response.data;
};

/**
 * Create new user
 */
export const createUser = async (
  data: UserCreateInput
): Promise<UserDetail> => {
  const response = await apiClient.post<UserDetail>("/api/v1/users", data);
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: UserUpdateInput
): Promise<UserDetail> => {
  const response = await apiClient.put<UserDetail>(`/api/v1/users/${id}`, data);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/users/${id}`);
};

/**
 * Assign user to tenant
 */
export const assignUserToTenant = async (
  userId: string,
  assignment: TenantAssignmentInput
): Promise<UserDetail> => {
  const response = await apiClient.post<UserDetail>(
    `/api/v1/users/${userId}/tenants`,
    assignment
  );
  return response.data;
};

/**
 * Remove user from tenant
 */
export const removeUserFromTenant = async (
  userId: string,
  tenantId: string
): Promise<UserDetail> => {
  const response = await apiClient.delete<UserDetail>(
    `/api/v1/users/${userId}/tenants/${tenantId}`
  );
  return response.data;
};

/**
 * Update user's roles and permissions for a specific tenant
 */
export const updateUserTenantRoles = async (
  userId: string,
  tenantId: string,
  roles: string[],
  permissions?: string[]
): Promise<UserDetail> => {
  const response = await apiClient.put<UserDetail>(
    `/api/v1/users/${userId}/tenants/${tenantId}`,
    {
      roles,
      permissions,
    }
  );
  return response.data;
};

/**
 * Validate email domain
 */
export const validateEmailDomain = async (
  email: string
): Promise<EmailValidationResult> => {
  const response = await apiClient.post<EmailValidationResult>(
    "/users/validate-email",
    { email }
  );
  return response.data;
};

/**
 * Bulk delete users
 */
export const bulkDeleteUsers = async (userIds: string[]): Promise<void> => {
  await apiClient.post("/api/v1/users/bulk-delete", { userIds });
};

/**
 * Bulk update user status
 */
export const bulkUpdateUserStatus = async (
  userIds: string[],
  status: "active" | "inactive" | "suspended"
): Promise<void> => {
  await apiClient.post("/users/bulk-update-status", { userIds, status });
};

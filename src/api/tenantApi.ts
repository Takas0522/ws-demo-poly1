import apiClient from './apiClient';
import {
  TenantDetail,
  TenantListResponse,
  TenantCreateInput,
  TenantUpdateInput,
  TenantListParams,
  UserListItem,
} from '../types/tenant';

/**
 * Tenant API Client
 * Provides methods for tenant management operations
 */

/**
 * Get paginated list of tenants
 */
export const getTenants = async (params: TenantListParams = {}): Promise<TenantListResponse> => {
  const response = await apiClient.get<TenantListResponse>('/tenants', { params });
  return response.data;
};

/**
 * Get tenant by ID
 */
export const getTenantById = async (id: string): Promise<TenantDetail> => {
  const response = await apiClient.get<TenantDetail>(`/tenants/${id}`);
  return response.data;
};

/**
 * Create new tenant
 */
export const createTenant = async (data: TenantCreateInput): Promise<TenantDetail> => {
  const response = await apiClient.post<TenantDetail>('/tenants', data);
  return response.data;
};

/**
 * Update tenant
 */
export const updateTenant = async (id: string, data: TenantUpdateInput): Promise<TenantDetail> => {
  const response = await apiClient.put<TenantDetail>(`/tenants/${id}`, data);
  return response.data;
};

/**
 * Delete tenant
 */
export const deleteTenant = async (id: string): Promise<void> => {
  await apiClient.delete(`/tenants/${id}`);
};

/**
 * Assign admin to tenant
 */
export const assignTenantAdmin = async (tenantId: string, userId: string): Promise<TenantDetail> => {
  const response = await apiClient.post<TenantDetail>(`/tenants/${tenantId}/admins`, { userId });
  return response.data;
};

/**
 * Remove admin from tenant
 */
export const removeTenantAdmin = async (tenantId: string, userId: string): Promise<TenantDetail> => {
  const response = await apiClient.delete<TenantDetail>(`/tenants/${tenantId}/admins/${userId}`);
  return response.data;
};

/**
 * Get available users for admin assignment
 */
export const getAvailableUsers = async (search?: string): Promise<UserListItem[]> => {
  const response = await apiClient.get<UserListItem[]>('/users', { params: { search } });
  return response.data;
};

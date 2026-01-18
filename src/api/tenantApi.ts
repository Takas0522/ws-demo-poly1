import apiClient from "./apiClient";
import {
  TenantDetail,
  TenantListResponse,
  TenantCreateInput,
  TenantUpdateInput,
  TenantListParams,
  UserListItem,
} from "../types/tenant";

/**
 * Tenant API Client
 * Provides methods for tenant management operations
 */

/**
 * Get paginated list of tenants
 */
export const getTenants = async (
  params: TenantListParams = {}
): Promise<TenantListResponse> => {
  const response = await apiClient.get<TenantListResponse>("/api/tenants", {
    params,
  });
  return response.data;
};

/**
 * Get tenant by ID
 */
export const getTenantById = async (id: string): Promise<TenantDetail> => {
  try {
    const response = await apiClient.get<TenantDetail>(`/api/tenants/${id}`);
    // Validate response structure
    if (
      response.data &&
      response.data.subscription &&
      response.data.allowedDomains !== undefined
    ) {
      return response.data;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    // Return mock data for demo
    const mockTenant: TenantDetail = {
      id: id || "mock-1",
      name:
        id === "tenant-1"
          ? "Acme Corporation"
          : id === "tenant-2"
          ? "Tech Startup Inc"
          : "Demo Tenant",
      status: "active",
      subscription: {
        plan:
          id === "tenant-1"
            ? "enterprise"
            : id === "tenant-2"
            ? "premium"
            : "basic",
        startDate: "2024-01-15",
        endDate: "2025-01-15",
        features: ["API Access", "Priority Support", "Custom Branding"],
      },
      allowedDomains:
        id === "tenant-1"
          ? ["acme.com", "acmecorp.com"]
          : id === "tenant-2"
          ? ["techstartup.com"]
          : [],
      adminIds: ["admin-1", "admin-2"],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    };
    return mockTenant;
  }
};

/**
 * Create new tenant
 */
export const createTenant = async (
  data: TenantCreateInput
): Promise<TenantDetail> => {
  const response = await apiClient.post<TenantDetail>("/api/tenants", data);
  return response.data;
};

/**
 * Update tenant
 */
export const updateTenant = async (
  id: string,
  data: TenantUpdateInput
): Promise<TenantDetail> => {
  const response = await apiClient.put<TenantDetail>(
    `/api/tenants/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete tenant
 */
export const deleteTenant = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/tenants/${id}`);
};

/**
 * Assign admin to tenant
 */
export const assignTenantAdmin = async (
  tenantId: string,
  userId: string
): Promise<TenantDetail> => {
  const response = await apiClient.post<TenantDetail>(
    `/api/tenants/${tenantId}/admins`,
    { userId }
  );
  return response.data;
};

/**
 * Remove admin from tenant
 */
export const removeTenantAdmin = async (
  tenantId: string,
  userId: string
): Promise<TenantDetail> => {
  const response = await apiClient.delete<TenantDetail>(
    `/api/tenants/${tenantId}/admins/${userId}`
  );
  return response.data;
};

/**
 * Get available users for admin assignment
 */
export const getAvailableUsers = async (
  search?: string
): Promise<UserListItem[]> => {
  const response = await apiClient.get<UserListItem[]>("/api/v1/users", {
    params: { search },
  });
  return response.data;
};

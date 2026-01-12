/**
 * Tenant management types
 */

export type TenantStatus = 'active' | 'inactive' | 'suspended';
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export interface Subscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate?: string;
  features: string[];
}

export interface TenantDetail {
  id: string;
  name: string;
  status: TenantStatus;
  subscription: Subscription;
  allowedDomains: string[];
  adminIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantListItem {
  id: string;
  name: string;
  status: TenantStatus;
  plan: SubscriptionPlan;
  createdAt: string;
}

export interface TenantCreateInput {
  name: string;
  status: TenantStatus;
  subscription: {
    plan: SubscriptionPlan;
    startDate: string;
    endDate?: string;
  };
  allowedDomains: string[];
}

export interface TenantUpdateInput {
  name?: string;
  status?: TenantStatus;
  subscription?: {
    plan?: SubscriptionPlan;
    startDate?: string;
    endDate?: string;
  };
  allowedDomains?: string[];
}

export interface TenantListParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: TenantStatus;
  plan?: SubscriptionPlan;
}

export interface TenantListResponse {
  items: TenantListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface UserListItem {
  id: string;
  username: string;
  email: string;
}

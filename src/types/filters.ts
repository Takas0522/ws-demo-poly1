/**
 * Saved filters types
 */

import { TenantStatus, SubscriptionPlan } from './tenant';
import { UserType, UserStatus } from './user';
import { ServiceCategory, ServiceStatus } from './service';

/**
 * Filter type
 */
export type FilterType = 'tenant' | 'user' | 'service';

/**
 * Base saved filter
 */
export interface BaseSavedFilter {
  id: string;
  name: string;
  type: FilterType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tenant filter criteria
 */
export interface TenantFilterCriteria {
  search?: string;
  status?: TenantStatus;
  plan?: SubscriptionPlan;
}

/**
 * User filter criteria
 */
export interface UserFilterCriteria {
  search?: string;
  userType?: UserType;
  status?: UserStatus;
  tenantId?: string;
}

/**
 * Service filter criteria
 */
export interface ServiceFilterCriteria {
  search?: string;
  category?: ServiceCategory;
  status?: ServiceStatus;
}

/**
 * Tenant saved filter
 */
export interface TenantSavedFilter extends BaseSavedFilter {
  type: 'tenant';
  criteria: TenantFilterCriteria;
}

/**
 * User saved filter
 */
export interface UserSavedFilter extends BaseSavedFilter {
  type: 'user';
  criteria: UserFilterCriteria;
}

/**
 * Service saved filter
 */
export interface ServiceSavedFilter extends BaseSavedFilter {
  type: 'service';
  criteria: ServiceFilterCriteria;
}

/**
 * Union type for all saved filters
 */
export type SavedFilter = TenantSavedFilter | UserSavedFilter | ServiceSavedFilter;

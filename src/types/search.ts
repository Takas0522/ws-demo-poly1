/**
 * Global search types
 */

import { TenantStatus, SubscriptionPlan } from './tenant';
import { UserType, UserStatus } from './user';
import { ServiceCategory, ServiceStatus } from './service';

/**
 * Search result category
 */
export type SearchCategory = 'tenant' | 'user' | 'service' | 'all';

/**
 * Base search result
 */
export interface BaseSearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  description?: string;
  path: string; // Navigation path
}

/**
 * Tenant search result
 */
export interface TenantSearchResult extends BaseSearchResult {
  category: 'tenant';
  status: TenantStatus;
  plan: SubscriptionPlan;
}

/**
 * User search result
 */
export interface UserSearchResult extends BaseSearchResult {
  category: 'user';
  email: string;
  userType: UserType;
  status: UserStatus;
}

/**
 * Service search result
 */
export interface ServiceSearchResult extends BaseSearchResult {
  category: 'service';
  serviceCategory: ServiceCategory;
  status: ServiceStatus;
}

/**
 * Union type for all search results
 */
export type SearchResult = TenantSearchResult | UserSearchResult | ServiceSearchResult;

/**
 * Search response
 */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  categories: {
    tenant: number;
    user: number;
    service: number;
  };
}

/**
 * Search filters
 */
export interface SearchFilters {
  query: string;
  category?: SearchCategory;
  limit?: number;
}

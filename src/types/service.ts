/**
 * Service management types
 */

export type ServiceCategory = 'storage' | 'communication' | 'analytics' | 'security' | 'integration';
export type ServiceStatus = 'available' | 'beta' | 'coming_soon';
export type PlanRequirement = 'free' | 'basic' | 'professional' | 'premium' | 'enterprise';

/**
 * Service feature flag
 */
export interface ServiceFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

/**
 * Service definition in the catalog
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  icon?: string;
  requiredPlan: PlanRequirement;
  features: ServiceFeature[];
  version?: string;
}

/**
 * Tenant-specific service assignment
 */
export interface TenantServiceAssignment {
  serviceId: string;
  enabled: boolean;
  enabledFeatures: string[]; // Array of feature IDs
  assignedAt?: string;
  assignedBy?: string;
}

/**
 * Service assignment for a specific tenant
 */
export interface TenantServiceConfig {
  tenantId: string;
  assignments: TenantServiceAssignment[];
}

/**
 * Service catalog filter params
 */
export interface ServiceCatalogFilters {
  category?: ServiceCategory;
  status?: ServiceStatus;
  search?: string;
}

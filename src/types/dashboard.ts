/**
 * Dashboard statistics and analytics types
 */

import { SubscriptionPlan, TenantStatus } from './tenant';
import { UserType, UserStatus } from './user';
import { ServiceCategory } from './service';

/**
 * Tenant statistics
 */
export interface TenantStats {
  total: number;
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  byPlan: {
    free: number;
    basic: number;
    premium: number;
    enterprise: number;
  };
}

/**
 * User statistics
 */
export interface UserStats {
  total: number;
  byType: {
    internal: number;
    external: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
}

/**
 * Service usage statistics
 */
export interface ServiceUsageStats {
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  tenantsUsing: number;
  totalTenants: number;
  usagePercentage: number;
}

/**
 * Activity feed item
 */
export interface ActivityItem {
  id: string;
  type: 'tenant_created' | 'tenant_updated' | 'user_created' | 'user_updated' | 'service_assigned' | 'service_enabled' | 'service_disabled';
  entityId: string;
  entityName: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

/**
 * Dashboard data
 */
export interface DashboardData {
  tenantStats: TenantStats;
  userStats: UserStats;
  serviceUsage: ServiceUsageStats[];
  recentActivity: ActivityItem[];
}

/**
 * Time range for dashboard filters
 */
export type TimeRange = '7d' | '30d' | '90d' | 'all';

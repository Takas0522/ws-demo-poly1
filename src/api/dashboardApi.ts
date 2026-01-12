import apiClient from './apiClient';
import { DashboardData, TimeRange, ActivityItem } from '../types/dashboard';
import { TenantListItem } from '../types/tenant';
import { UserListItem } from '../types/user';
import { Service } from '../types/service';

/**
 * Dashboard API Client
 * Provides methods for fetching dashboard statistics and analytics
 */

/**
 * Get dashboard data with statistics
 */
export const getDashboardData = async (timeRange: TimeRange = '30d'): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>('/dashboard', { 
      params: { timeRange } 
    });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock dashboard data');
    // Return mock data
    return generateMockDashboardData();
  }
};

/**
 * Get recent activity feed
 */
export const getRecentActivity = async (limit: number = 10): Promise<ActivityItem[]> => {
  try {
    const response = await apiClient.get<ActivityItem[]>('/dashboard/activity', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock activity data');
    return generateMockActivity();
  }
};

/**
 * Generate mock dashboard data for demo
 */
function generateMockDashboardData(): DashboardData {
  return {
    tenantStats: {
      total: 156,
      byStatus: {
        active: 132,
        inactive: 18,
        suspended: 6,
      },
      byPlan: {
        free: 45,
        basic: 68,
        premium: 32,
        enterprise: 11,
      },
    },
    userStats: {
      total: 2847,
      byType: {
        internal: 423,
        external: 2424,
      },
      byStatus: {
        active: 2654,
        inactive: 156,
        suspended: 37,
      },
    },
    serviceUsage: [
      {
        serviceId: 'service-messaging',
        serviceName: 'メッセージング',
        category: 'communication',
        tenantsUsing: 142,
        totalTenants: 156,
        usagePercentage: 91.0,
      },
      {
        serviceId: 'service-file-storage',
        serviceName: 'ファイル管理',
        category: 'storage',
        tenantsUsing: 98,
        totalTenants: 156,
        usagePercentage: 62.8,
      },
      {
        serviceId: 'service-analytics',
        serviceName: 'アナリティクス',
        category: 'analytics',
        tenantsUsing: 43,
        totalTenants: 156,
        usagePercentage: 27.6,
      },
      {
        serviceId: 'service-security',
        serviceName: 'セキュリティ管理',
        category: 'security',
        tenantsUsing: 18,
        totalTenants: 156,
        usagePercentage: 11.5,
      },
      {
        serviceId: 'service-api-integration',
        serviceName: 'API統合',
        category: 'integration',
        tenantsUsing: 67,
        totalTenants: 156,
        usagePercentage: 42.9,
      },
      {
        serviceId: 'service-notification',
        serviceName: '通知システム',
        category: 'communication',
        tenantsUsing: 124,
        totalTenants: 156,
        usagePercentage: 79.5,
      },
    ],
    recentActivity: generateMockActivity(),
  };
}

/**
 * Generate mock activity data
 */
function generateMockActivity(): ActivityItem[] {
  const now = new Date();
  
  return [
    {
      id: 'act-1',
      type: 'tenant_created',
      entityId: 'tenant-156',
      entityName: 'NewTech Solutions',
      description: 'テナントが作成されました',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
    {
      id: 'act-2',
      type: 'service_enabled',
      entityId: 'service-analytics',
      entityName: 'アナリティクス',
      description: 'テナント "Acme Corporation" でサービスが有効化されました',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      userId: 'user-2',
      userName: 'tenant-admin@acme.com',
    },
    {
      id: 'act-3',
      type: 'user_created',
      entityId: 'user-2847',
      entityName: 'john.doe@company.com',
      description: 'ユーザーが作成されました',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
    {
      id: 'act-4',
      type: 'tenant_updated',
      entityId: 'tenant-42',
      entityName: 'Global Systems Inc',
      description: 'テナントプランが Basic から Premium に更新されました',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
    {
      id: 'act-5',
      type: 'service_disabled',
      entityId: 'service-backup',
      entityName: 'バックアップ',
      description: 'テナント "Tech Startup Inc" でサービスが無効化されました',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      userId: 'user-5',
      userName: 'admin@techstartup.com',
    },
    {
      id: 'act-6',
      type: 'user_updated',
      entityId: 'user-1234',
      entityName: 'jane.smith@example.com',
      description: 'ユーザーステータスが "inactive" から "active" に更新されました',
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
    {
      id: 'act-7',
      type: 'service_assigned',
      entityId: 'service-security',
      entityName: 'セキュリティ管理',
      description: 'テナント "Enterprise Corp" にサービスが割り当てられました',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
    {
      id: 'act-8',
      type: 'tenant_created',
      entityId: 'tenant-155',
      entityName: 'Digital Innovations',
      description: 'テナントが作成されました',
      timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      userId: 'user-1',
      userName: 'admin@example.com',
    },
  ];
}

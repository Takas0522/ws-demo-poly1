import apiClient from './apiClient';
import {
  Service,
  ServiceCatalogFilters,
  TenantServiceConfig,
  TenantServiceAssignment,
  ServiceCategory,
  ServiceStatus,
} from '../types/service';

/**
 * Service API Client
 * Provides methods for service catalog and tenant service assignment
 */

/**
 * Mock service data for demo purposes
 */
const mockServices: Service[] = [
  {
    id: 'service-file-storage',
    name: 'ファイル管理',
    description: 'クラウドベースのファイルストレージとドキュメント管理システム',
    category: 'storage',
    status: 'available',
    requiredPlan: 'professional',
    features: [
      { id: 'f1', name: 'ファイルアップロード', description: '基本的なファイルアップロード機能', enabled: true },
      { id: 'f2', name: 'バージョン管理', description: 'ファイルのバージョン履歴管理', enabled: true },
      { id: 'f3', name: '高度な検索', description: 'ファイル内容の全文検索', enabled: false },
    ],
    version: '2.1.0',
  },
  {
    id: 'service-messaging',
    name: 'メッセージング',
    description: 'リアルタイムチャットとビデオ会議システム',
    category: 'communication',
    status: 'available',
    requiredPlan: 'basic',
    features: [
      { id: 'f4', name: 'テキストチャット', description: '1対1およびグループチャット', enabled: true },
      { id: 'f5', name: 'ビデオ通話', description: 'HD品質のビデオ通話', enabled: true },
      { id: 'f6', name: '画面共有', description: 'リアルタイム画面共有', enabled: false },
    ],
    version: '1.8.5',
  },
  {
    id: 'service-analytics',
    name: 'アナリティクス',
    description: '高度なデータ分析とレポート生成ツール',
    category: 'analytics',
    status: 'available',
    requiredPlan: 'premium',
    features: [
      { id: 'f7', name: '基本レポート', description: '標準的なレポート機能', enabled: true },
      { id: 'f8', name: 'カスタムダッシュボード', description: 'カスタマイズ可能なダッシュボード', enabled: true },
      { id: 'f9', name: 'AI予測分析', description: '機械学習による予測分析', enabled: true },
    ],
    version: '3.0.2',
  },
  {
    id: 'service-security',
    name: 'セキュリティ管理',
    description: '包括的なセキュリティ監視とアクセス制御',
    category: 'security',
    status: 'available',
    requiredPlan: 'enterprise',
    features: [
      { id: 'f10', name: 'アクセスログ', description: '詳細なアクセスログ記録', enabled: true },
      { id: 'f11', name: '脅威検知', description: 'リアルタイム脅威検知', enabled: true },
      { id: 'f12', name: 'コンプライアンス監査', description: '自動コンプライアンスチェック', enabled: true },
    ],
    version: '4.2.1',
  },
  {
    id: 'service-api-integration',
    name: 'API統合',
    description: 'サードパーティシステムとのAPI統合',
    category: 'integration',
    status: 'available',
    requiredPlan: 'professional',
    features: [
      { id: 'f13', name: 'REST API', description: 'RESTful API アクセス', enabled: true },
      { id: 'f14', name: 'Webhook', description: 'イベント駆動型Webhook', enabled: true },
      { id: 'f15', name: 'カスタムコネクタ', description: 'カスタムシステム統合', enabled: false },
    ],
    version: '2.5.0',
  },
  {
    id: 'service-notification',
    name: '通知システム',
    description: 'マルチチャネル通知配信システム',
    category: 'communication',
    status: 'available',
    requiredPlan: 'basic',
    features: [
      { id: 'f16', name: 'メール通知', description: 'メールによる通知配信', enabled: true },
      { id: 'f17', name: 'プッシュ通知', description: 'モバイルプッシュ通知', enabled: true },
      { id: 'f18', name: 'SMS通知', description: 'SMS経由の通知配信', enabled: false },
    ],
    version: '1.3.2',
  },
  {
    id: 'service-backup',
    name: 'バックアップ',
    description: '自動バックアップとリカバリシステム',
    category: 'storage',
    status: 'beta',
    requiredPlan: 'premium',
    features: [
      { id: 'f19', name: '自動バックアップ', description: 'スケジュール自動バックアップ', enabled: true },
      { id: 'f20', name: 'ポイントインタイムリカバリ', description: '特定時点への復元', enabled: true },
      { id: 'f21', name: 'クロスリージョンバックアップ', description: '地域をまたいだバックアップ', enabled: false },
    ],
    version: '0.9.5',
  },
  {
    id: 'service-workflow',
    name: 'ワークフロー自動化',
    description: 'ビジネスプロセスの自動化ツール',
    category: 'integration',
    status: 'coming_soon',
    requiredPlan: 'enterprise',
    features: [
      { id: 'f22', name: 'ワークフローエディタ', description: 'ビジュアルワークフロー作成', enabled: false },
      { id: 'f23', name: '条件分岐', description: '複雑な条件分岐処理', enabled: false },
      { id: 'f24', name: 'スケジューラー', description: 'タイムベースの実行', enabled: false },
    ],
    version: '0.1.0',
  },
];

/**
 * Mock tenant service assignments
 */
const mockTenantServices: Record<string, TenantServiceAssignment[]> = {
  'tenant-1': [
    { serviceId: 'service-file-storage', enabled: true, enabledFeatures: ['f1', 'f2'] },
    { serviceId: 'service-messaging', enabled: true, enabledFeatures: ['f4', 'f5'] },
    { serviceId: 'service-analytics', enabled: false, enabledFeatures: [] },
  ],
  'tenant-2': [
    { serviceId: 'service-file-storage', enabled: false, enabledFeatures: [] },
    { serviceId: 'service-messaging', enabled: true, enabledFeatures: ['f4'] },
  ],
};

/**
 * Get all services from catalog
 */
export const getServices = async (filters?: ServiceCatalogFilters): Promise<Service[]> => {
  try {
    const response = await apiClient.get<Service[]>('/services', { params: filters });
    // Check if response data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.warn('API not available, using mock data');
    // Filter mock data
    let filtered = [...mockServices];
    
    if (filters?.category) {
      filtered = filtered.filter(s => s.category === filters.category);
    }
    
    if (filters?.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const response = await apiClient.get<Service>(`/services/${id}`);
    // Check if response data is valid
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.warn('API not available, using mock data');
    return mockServices.find(s => s.id === id) || null;
  }
};

/**
 * Get tenant service configuration
 */
export const getTenantServices = async (tenantId: string): Promise<TenantServiceConfig> => {
  try {
    const response = await apiClient.get<TenantServiceConfig>(`/tenants/${tenantId}/services`);
    // Check if response data is valid
    if (response.data && response.data.tenantId && Array.isArray(response.data.assignments)) {
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.warn('API not available, using mock data');
    return {
      tenantId,
      assignments: mockTenantServices[tenantId] || [],
    };
  }
};

/**
 * Update tenant service assignment
 */
export const updateTenantService = async (
  tenantId: string,
  serviceId: string,
  enabled: boolean,
  enabledFeatures?: string[]
): Promise<TenantServiceConfig> => {
  try {
    const response = await apiClient.put<TenantServiceConfig>(
      `/tenants/${tenantId}/services/${serviceId}`,
      { enabled, enabledFeatures }
    );
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Update mock data
    if (!mockTenantServices[tenantId]) {
      mockTenantServices[tenantId] = [];
    }
    
    const existingIndex = mockTenantServices[tenantId].findIndex(a => a.serviceId === serviceId);
    const assignment: TenantServiceAssignment = {
      serviceId,
      enabled,
      enabledFeatures: enabledFeatures || [],
      assignedAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      mockTenantServices[tenantId][existingIndex] = assignment;
    } else {
      mockTenantServices[tenantId].push(assignment);
    }
    
    return {
      tenantId,
      assignments: mockTenantServices[tenantId],
    };
  }
};

/**
 * Toggle service feature for a tenant
 */
export const toggleTenantServiceFeature = async (
  tenantId: string,
  serviceId: string,
  featureId: string,
  enabled: boolean
): Promise<TenantServiceConfig> => {
  try {
    const response = await apiClient.patch<TenantServiceConfig>(
      `/tenants/${tenantId}/services/${serviceId}/features/${featureId}`,
      { enabled }
    );
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Update mock data
    if (!mockTenantServices[tenantId]) {
      mockTenantServices[tenantId] = [];
    }
    
    const assignment = mockTenantServices[tenantId].find(a => a.serviceId === serviceId);
    if (assignment) {
      if (enabled && !assignment.enabledFeatures.includes(featureId)) {
        assignment.enabledFeatures.push(featureId);
      } else if (!enabled) {
        assignment.enabledFeatures = assignment.enabledFeatures.filter(id => id !== featureId);
      }
    }
    
    return {
      tenantId,
      assignments: mockTenantServices[tenantId],
    };
  }
};

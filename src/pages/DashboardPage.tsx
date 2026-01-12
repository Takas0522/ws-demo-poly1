import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { getDashboardData } from '../api/dashboardApi';
import { DashboardData, ActivityItem, TimeRange } from '../types/dashboard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

/**
 * Dashboard Page Component
 * Displays statistics, charts, and activity feed
 */
const DashboardPage: React.FC = () => {
  const { t, language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await getDashboardData(timeRange);
      setData(dashboardData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'Failed to load dashboard data'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ja' ? 'ダッシュボード' : 'Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ja' ? 'システムの統計とアクティビティ' : 'System statistics and activity'}
          </p>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">{language === 'ja' ? '過去7日' : 'Last 7 days'}</option>
          <option value="30d">{language === 'ja' ? '過去30日' : 'Last 30 days'}</option>
          <option value="90d">{language === 'ja' ? '過去90日' : 'Last 90 days'}</option>
          <option value="all">{language === 'ja' ? 'すべての期間' : 'All time'}</option>
        </select>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Tenant Stats */}
        <StatCard
          title={language === 'ja' ? 'テナント統計' : 'Tenant Statistics'}
          total={data.tenantStats.total}
          breakdown={[
            { label: t.active, value: data.tenantStats.byStatus.active, variant: 'success' },
            { label: t.inactive, value: data.tenantStats.byStatus.inactive, variant: 'warning' },
            { label: t.suspended, value: data.tenantStats.byStatus.suspended, variant: 'danger' },
          ]}
        />

        {/* User Stats */}
        <StatCard
          title={language === 'ja' ? 'ユーザー統計' : 'User Statistics'}
          total={data.userStats.total}
          breakdown={[
            { label: t.internal, value: data.userStats.byType.internal, variant: 'info' },
            { label: t.external, value: data.userStats.byType.external, variant: 'default' },
            { label: t.active, value: data.userStats.byStatus.active, variant: 'success' },
          ]}
        />

        {/* Plan Distribution */}
        <StatCard
          title={language === 'ja' ? 'プラン別テナント' : 'Tenants by Plan'}
          total={data.tenantStats.total}
          breakdown={[
            { label: t.enterprise, value: data.tenantStats.byPlan.enterprise, variant: 'info' },
            { label: t.premium, value: data.tenantStats.byPlan.premium, variant: 'success' },
            { label: t.basic, value: data.tenantStats.byPlan.basic, variant: 'default' },
            { label: t.free, value: data.tenantStats.byPlan.free, variant: 'warning' },
          ]}
        />
      </div>

      {/* Service Usage Chart */}
      <Card title={language === 'ja' ? 'サービス使用状況' : 'Service Usage'} className="mb-6">
        <div className="space-y-4">
          {data.serviceUsage.map((service) => (
            <div key={service.serviceId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{service.serviceName}</span>
                  <Badge variant="default" size="sm">
                    {service.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600">
                  {service.tenantsUsing} / {service.totalTenants} ({service.usagePercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${service.usagePercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Feed */}
      <Card title={language === 'ja' ? 'アクティビティフィード' : 'Activity Feed'}>
        <div className="space-y-4">
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {language === 'ja' ? '最近のアクティビティはありません' : 'No recent activity'}
            </div>
          ) : (
            data.recentActivity.map((activity) => (
              <ActivityItemComponent key={activity.id} activity={activity} language={language} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  total: number;
  breakdown: Array<{
    label: string;
    value: number;
    variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, total, breakdown }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-3xl font-bold text-primary-600">{total.toLocaleString()}</div>
        <div className="space-y-2">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <Badge variant={item.variant} size="sm">
                {item.value.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

/**
 * Activity Item Component
 */
interface ActivityItemProps {
  activity: ActivityItem;
  language: 'en' | 'ja';
}

const ActivityItemComponent: React.FC<ActivityItemProps> = ({ activity, language }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'tenant_created':
        return '🏢';
      case 'tenant_updated':
        return '✏️';
      case 'user_created':
        return '👤';
      case 'user_updated':
        return '👤';
      case 'service_assigned':
        return '📦';
      case 'service_enabled':
        return '✅';
      case 'service_disabled':
        return '❌';
      default:
        return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return language === 'ja' ? `${diffMins}分前` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return language === 'ja' ? `${diffHours}時間前` : `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return language === 'ja' ? `${diffDays}日前` : `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US');
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{activity.entityName}</span>
          <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
        </div>
        <p className="text-sm text-gray-600">{activity.description}</p>
        {activity.userName && (
          <p className="text-xs text-gray-500 mt-1">
            {language === 'ja' ? '実行者' : 'By'}: {activity.userName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

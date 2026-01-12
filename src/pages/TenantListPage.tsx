import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTenants } from '../api/tenantApi';
import { TenantListItem, TenantStatus, SubscriptionPlan } from '../types/tenant';
import { Table, TableSkeleton, EmptyState } from '../components/ui';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';
import { useToast } from '../contexts/ToastContext';

/**
 * Tenant List Page
 * Displays paginated list of tenants with filtering and search
 * Only accessible by global administrators
 */
const TenantListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const toast = useToast();
  
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | ''>('');
  const [planFilter, setPlanFilter] = useState<SubscriptionPlan | ''>('');

  // Load tenants
  const loadTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await getTenants({
        page,
        perPage,
        search: search || undefined,
        status: statusFilter || undefined,
        plan: planFilter || undefined,
      });
      
      // Check if response has expected structure
      if (response.items && Array.isArray(response.items)) {
        setTenants(response.items);
        setTotalPages(response.totalPages || 1);
      } else {
        // API returned but with wrong structure, use mock data
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
      // For demo purposes, use mock data when API is not available
      const mockTenants: TenantListItem[] = [
        {
          id: 'tenant-1',
          name: 'Acme Corporation',
          status: 'active',
          plan: 'enterprise',
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'tenant-2',
          name: 'Tech Startup Inc',
          status: 'active',
          plan: 'premium',
          createdAt: '2024-02-20T14:15:00Z',
        },
        {
          id: 'tenant-3',
          name: 'Small Business LLC',
          status: 'active',
          plan: 'basic',
          createdAt: '2024-03-10T09:00:00Z',
        },
        {
          id: 'tenant-4',
          name: 'Demo Organization',
          status: 'inactive',
          plan: 'free',
          createdAt: '2024-01-05T16:45:00Z',
        },
      ];
      setTenants(mockTenants);
      setTotalPages(1);
      setError('Using mock data - Backend API not available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, [page, search, statusFilter, planFilter]);

  const handleRowClick = (row: Record<string, any>) => {
    navigate(`/admin/tenants/${row.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as TenantStatus | '');
    setPage(1);
  };

  const handlePlanFilterChange = (value: string) => {
    setPlanFilter(value as SubscriptionPlan | '');
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { key: 'name', label: t.tenantName },
    { key: 'status', label: t.status },
    { key: 'plan', label: t.plan },
    { key: 'createdAt', label: t.createdAt },
  ];

  const tableData = tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    status: tenant.status,
    plan: tenant.plan,
    createdAt: formatDate(tenant.createdAt),
  }));

  return (
    <AuthorizedComponent permissions="global.admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{t.tenantManagement}</h1>
            <Button onClick={() => navigate('/admin/tenants/new')}>
              {t.createTenant}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              type="text"
              placeholder={t.searchTenants}
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              options={[
                { value: '', label: t.allStatuses },
                { value: 'active', label: t.active },
                { value: 'inactive', label: t.inactive },
                { value: 'suspended', label: t.suspended },
              ]}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            />
            <Select
              options={[
                { value: '', label: t.allPlans },
                { value: 'free', label: t.free },
                { value: 'basic', label: t.basic },
                { value: 'premium', label: t.premium },
                { value: 'enterprise', label: t.enterprise },
              ]}
              value={planFilter}
              onChange={handlePlanFilterChange}
            />
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : tenants.length === 0 ? (
          <EmptyState
            title={t.noTenantsFound}
            description={search || statusFilter || planFilter
              ? 'Try adjusting your filters to find what you\'re looking for'
              : 'Get started by creating your first tenant'}
            icon={
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            action={!search && !statusFilter && !planFilter ? {
              label: t.createTenant,
              onClick: () => navigate('/admin/tenants/new')
            } : undefined}
          />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow">
              <Table columns={columns} data={tableData} onRowClick={handleRowClick} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t.previous}
                </Button>
                <span className="text-sm text-gray-700">
                  {t.pageXofY.replace('{{current}}', String(page)).replace('{{total}}', String(totalPages))}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {t.next}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AuthorizedComponent>
  );
};

export default TenantListPage;

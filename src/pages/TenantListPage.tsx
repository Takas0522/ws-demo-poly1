import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTenants } from '../api/tenantApi';
import { TenantListItem, TenantStatus, SubscriptionPlan } from '../types/tenant';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * Tenant List Page
 * Displays paginated list of tenants with filtering and search
 * Only accessible by global administrators
 */
const TenantListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
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
      const response = await getTenants({
        page,
        perPage,
        search: search || undefined,
        status: statusFilter || undefined,
        plan: planFilter || undefined,
      });
      setTenants(response.items);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load tenants:', err);
      setError('Failed to load tenants. Please try again.');
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
              placeholder={t.filterByStatus}
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
              placeholder={t.filterByPlan}
            />
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t.noTenantsFound}
          </div>
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

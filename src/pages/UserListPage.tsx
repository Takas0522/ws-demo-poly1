import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, bulkDeleteUsers, bulkUpdateUserStatus } from '../api/userApi';
import { UserListItem, UserType, UserStatus } from '../types/user';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * User List Page
 * Displays paginated list of users with filtering and search
 * Supports multi-tenant display and bulk operations
 */
const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  
  // Filters
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | ''>('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  
  // Bulk operations
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUsers({
        page,
        perPage,
        search: search || undefined,
        userType: userTypeFilter || undefined,
        status: statusFilter || undefined,
      });
      
      if (response.items && Array.isArray(response.items)) {
        setUsers(response.items);
        setTotalPages(response.totalPages || 1);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      // Mock data for demo
      const mockUsers: UserListItem[] = [
        {
          id: 'user-1',
          username: 'john.doe',
          email: 'john.doe@company.com',
          userType: 'internal',
          status: 'active',
          tenants: [
            { id: 'tenant-1', name: 'Acme Corporation' },
            { id: 'tenant-2', name: 'Tech Startup Inc' },
          ],
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'user-2',
          username: 'jane.smith',
          email: 'jane.smith@company.com',
          userType: 'internal',
          status: 'active',
          tenants: [
            { id: 'tenant-1', name: 'Acme Corporation' },
          ],
          createdAt: '2024-02-20T14:15:00Z',
        },
        {
          id: 'user-3',
          username: 'bob.external',
          email: 'bob@external.com',
          userType: 'external',
          status: 'active',
          tenants: [
            { id: 'tenant-2', name: 'Tech Startup Inc' },
          ],
          createdAt: '2024-03-10T09:00:00Z',
        },
        {
          id: 'user-4',
          username: 'alice.inactive',
          email: 'alice@company.com',
          userType: 'internal',
          status: 'inactive',
          tenants: [],
          createdAt: '2024-01-05T16:45:00Z',
        },
      ];
      
      // Apply filters to mock data
      let filteredUsers = mockUsers;
      if (search) {
        filteredUsers = filteredUsers.filter(u => 
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (userTypeFilter) {
        filteredUsers = filteredUsers.filter(u => u.userType === userTypeFilter);
      }
      if (statusFilter) {
        filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
      }
      
      setUsers(filteredUsers);
      setTotalPages(1);
      setError('Using mock data - Backend API not available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search, userTypeFilter, statusFilter]);

  const handleRowClick = (row: Record<string, any>) => {
    navigate(`/admin/users/${row.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleUserTypeFilterChange = (value: string) => {
    setUserTypeFilter(value as UserType | '');
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as UserStatus | '');
    setPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;
    
    try {
      if (bulkAction === 'delete') {
        await bulkDeleteUsers(selectedUsers);
        setSelectedUsers([]);
        loadUsers();
      } else if (['active', 'inactive', 'suspended'].includes(bulkAction)) {
        await bulkUpdateUserStatus(selectedUsers, bulkAction as UserStatus);
        setSelectedUsers([]);
        loadUsers();
      }
      setBulkAction('');
    } catch (err) {
      console.error('Bulk operation failed:', err);
      alert(t.bulkOperationFailed || 'Bulk operation failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderTenants = (tenants: { id: string; name: string }[]) => {
    if (tenants.length === 0) {
      return <span className="text-gray-400">{t.noTenants || 'No tenants'}</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {tenants.slice(0, 2).map(tenant => (
          <Badge key={tenant.id} variant="info" size="sm">
            {tenant.name}
          </Badge>
        ))}
        {tenants.length > 2 && (
          <Badge variant="default" size="sm">
            +{tenants.length - 2}
          </Badge>
        )}
      </div>
    );
  };

  const renderStatus = (status: UserStatus) => {
    const variants: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const renderUserType = (userType: UserType) => {
    return (
      <Badge variant={userType === 'internal' ? 'info' : 'default'}>
        {userType}
      </Badge>
    );
  };

  const columns = [
    { key: 'select', label: '' },
    { key: 'username', label: t.username },
    { key: 'email', label: t.email || 'Email' },
    { key: 'userType', label: t.userType || 'User Type' },
    { key: 'status', label: t.status },
    { key: 'tenants', label: t.tenants || 'Tenants' },
    { key: 'createdAt', label: t.createdAt },
  ];

  const tableData = users.map(user => ({
    id: user.id,
    select: (
      <input
        type="checkbox"
        checked={selectedUsers.includes(user.id)}
        onChange={(e) => {
          e.stopPropagation();
          handleSelectUser(user.id);
        }}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    username: user.username,
    email: user.email,
    userType: renderUserType(user.userType),
    status: renderStatus(user.status),
    tenants: renderTenants(user.tenants),
    createdAt: formatDate(user.createdAt),
  }));

  return (
    <AuthorizedComponent permissions="user.manage">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.userManagement || 'User Management'}
            </h1>
            <Button onClick={() => navigate('/admin/users/new')}>
              {t.createUser || 'Create User'}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              type="text"
              placeholder={t.searchUsers || 'Search users...'}
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              options={[
                { value: '', label: t.allUserTypes || 'All User Types' },
                { value: 'internal', label: t.internal || 'Internal' },
                { value: 'external', label: t.external || 'External' },
              ]}
              value={userTypeFilter}
              onChange={handleUserTypeFilterChange}
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
          </div>

          {/* Bulk operations */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {selectedUsers.length} {t.selected || 'selected'}
              </span>
              <Select
                options={[
                  { value: '', label: t.selectAction || 'Select action...' },
                  { value: 'active', label: t.setActive || 'Set Active' },
                  { value: 'inactive', label: t.setInactive || 'Set Inactive' },
                  { value: 'suspended', label: t.setSuspended || 'Set Suspended' },
                  { value: 'delete', label: t.deleteSelected || 'Delete' },
                ]}
                value={bulkAction}
                onChange={setBulkAction}
              />
              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                size="sm"
              >
                {t.apply || 'Apply'}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t.noUsersFound || 'No users found'}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-3 border-b border-gray-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t.selectAll || 'Select All'}
                  </span>
                </label>
              </div>
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
                  {(t.pageXofY || 'Page {{current}} of {{total}}')
                    .replace('{{current}}', String(page))
                    .replace('{{total}}', String(totalPages))}
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

export default UserListPage;

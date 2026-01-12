import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser, deleteUser } from '../api/userApi';
import { UserDetail, UserStatus, UserType } from '../types/user';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * User Detail Page
 * View and edit user details
 */
const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    userType: 'external' as UserType,
    status: 'active' as UserStatus,
  });

  useEffect(() => {
    if (id) {
      loadUser(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        userType: userData.userType,
        status: userData.status,
      });
    } catch (err) {
      console.error('Failed to load user:', err);
      // Mock data for demo
      const mockUser: UserDetail = {
        id: userId,
        username: 'john.doe',
        email: 'john.doe@company.com',
        userType: 'internal',
        status: 'active',
        tenantAssignments: [
          {
            tenantId: 'tenant-1',
            tenantName: 'Acme Corporation',
            roles: ['tenant-admin', 'user'],
            permissions: ['user.view', 'user.edit'],
            isPrimary: true,
          },
          {
            tenantId: 'tenant-2',
            tenantName: 'Tech Startup Inc',
            roles: ['viewer'],
            permissions: ['user.view'],
            isPrimary: false,
          },
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-03-20T14:15:00Z',
      };
      setUser(mockUser);
      setFormData({
        username: mockUser.username,
        email: mockUser.email,
        userType: mockUser.userType,
        status: mockUser.status,
      });
      setError('Using mock data - Backend API not available');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      setError(null);
      
      await updateUser(id, {
        username: formData.username,
        email: formData.email,
        userType: formData.userType,
        status: formData.status,
      });
      
      loadUser(id);
      alert(t.userUpdated || 'User updated successfully');
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || t.updateUserFailed || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm(t.confirmDeleteUser || 'Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteUser(id);
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.message || t.deleteUserFailed || 'Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="danger">
          {t.userNotFound || 'User not found'}
        </Alert>
      </div>
    );
  }

  const basicInfoTab = (
    <div className="space-y-4">
      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
        </Alert>
      )}

      <Input
        label={t.username}
        type="text"
        value={formData.username}
        onChange={(e) => handleChange('username', e.target.value)}
      />

      <Input
        label={t.email || 'Email'}
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />

      <Select
        label={t.userType || 'User Type'}
        options={[
          { value: 'internal', label: t.internal || 'Internal' },
          { value: 'external', label: t.external || 'External' },
        ]}
        value={formData.userType}
        onChange={(value) => handleChange('userType', value)}
      />

      <Select
        label={t.status}
        options={[
          { value: 'active', label: t.active },
          { value: 'inactive', label: t.inactive },
          { value: 'suspended', label: t.suspended },
        ]}
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.createdAt}
          </label>
          <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.updatedAt || 'Updated At'}
          </label>
          <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="danger"
          onClick={handleDelete}
        >
          {t.deleteUser || 'Delete User'}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/users')}
          >
            {t.back}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t.saving : t.save}
          </Button>
        </div>
      </div>
    </div>
  );

  const tenantsTab = (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {t.tenantAssignments || 'Tenant Assignments'}
        </h3>
        <Button
          size="sm"
          onClick={() => navigate(`/admin/users/${id}/tenants`)}
        >
          {t.manageTenants || 'Manage Tenants'}
        </Button>
      </div>

      {user.tenantAssignments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t.noTenantAssignments || 'No tenant assignments'}
        </p>
      ) : (
        <div className="space-y-4">
          {user.tenantAssignments.map((assignment) => (
            <div
              key={assignment.tenantId}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {assignment.tenantName}
                  </h4>
                  {assignment.isPrimary && (
                    <Badge variant="info" size="sm" className="mt-1">
                      {t.primaryTenant || 'Primary'}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/users/${id}/tenants/${assignment.tenantId}`)}
                >
                  {t.edit || 'Edit'}
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t.roles}:
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.roles.map((role) => (
                      <Badge key={role} variant="default" size="sm">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t.permissions}:
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.permissions.map((permission) => (
                      <Badge key={permission} variant="default" size="sm">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    {
      id: 'basic',
      label: t.basicInformation,
      content: basicInfoTab,
    },
    {
      id: 'tenants',
      label: t.tenants || 'Tenants',
      content: tenantsTab,
    },
  ];

  return (
    <AuthorizedComponent permissions="user.manage">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.userDetails || 'User Details'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </AuthorizedComponent>
  );
};

export default UserDetailPage;

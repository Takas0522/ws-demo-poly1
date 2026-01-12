import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, assignUserToTenant, removeUserFromTenant, updateUserTenantRoles } from '../api/userApi';
import { getTenants } from '../api/tenantApi';
import { UserDetail, TenantAssignmentInput } from '../types/user';
import { TenantListItem } from '../types/tenant';
import { Translations } from '../i18n/translations';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { MultiSelect } from '../components/ui/MultiSelect';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * User Tenants Page
 * Manage user's tenant assignments with roles and permissions
 */
const UserTenantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add tenant modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  // Available roles (this could come from API)
  const availableRoles = [
    { value: 'tenant-admin', label: 'Tenant Admin' },
    { value: 'user', label: 'User' },
    { value: 'viewer', label: 'Viewer' },
    { value: 'editor', label: 'Editor' },
  ];

  useEffect(() => {
    if (id) {
      loadUser(id);
      loadTenants();
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(userId);
      setUser(userData);
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
            permissions: ['user.view', 'user.edit', 'tenant.manage'],
            isPrimary: true,
          },
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-03-20T14:15:00Z',
      };
      setUser(mockUser);
      setError('Using mock data - Backend API not available');
    } finally {
      setLoading(false);
    }
  };

  const loadTenants = async () => {
    try {
      const response = await getTenants({ perPage: 100 });
      setTenants(response.items || []);
    } catch (err) {
      console.error('Failed to load tenants:', err);
      // Mock tenants for demo
      setTenants([
        { id: 'tenant-1', name: 'Acme Corporation', status: 'active', plan: 'enterprise', createdAt: '2024-01-15T10:30:00Z' },
        { id: 'tenant-2', name: 'Tech Startup Inc', status: 'active', plan: 'premium', createdAt: '2024-02-20T14:15:00Z' },
        { id: 'tenant-3', name: 'Small Business LLC', status: 'active', plan: 'basic', createdAt: '2024-03-10T09:00:00Z' },
      ]);
    }
  };

  const getAvailableTenants = () => {
    const assignedTenantIds = user?.tenantAssignments.map(a => a.tenantId) || [];
    return tenants.filter(t => !assignedTenantIds.includes(t.id));
  };

  const handleAddTenant = async () => {
    if (!id || !selectedTenantId || selectedRoles.length === 0) {
      alert(t.pleaseSelectTenantAndRoles || 'Please select a tenant and at least one role');
      return;
    }
    
    try {
      setAdding(true);
      const assignment: TenantAssignmentInput = {
        tenantId: selectedTenantId,
        roles: selectedRoles,
      };
      
      await assignUserToTenant(id, assignment);
      await loadUser(id);
      
      setIsAddModalOpen(false);
      setSelectedTenantId('');
      setSelectedRoles([]);
    } catch (err: any) {
      console.error('Failed to assign tenant:', err);
      alert(err.response?.data?.message || t.assignTenantFailed || 'Failed to assign tenant');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTenant = async (tenantId: string) => {
    if (!id) return;
    
    if (!confirm(t.confirmRemoveTenant || 'Are you sure you want to remove this tenant assignment?')) {
      return;
    }
    
    try {
      await removeUserFromTenant(id, tenantId);
      await loadUser(id);
    } catch (err: any) {
      console.error('Failed to remove tenant:', err);
      alert(err.response?.data?.message || t.removeTenantFailed || 'Failed to remove tenant');
    }
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

  // Create tabs for each tenant
  const tenantTabs = user.tenantAssignments.map((assignment) => ({
    id: assignment.tenantId,
    label: (
      <span className="flex items-center gap-2">
        {assignment.tenantName}
        {assignment.isPrimary && (
          <Badge variant="info" size="sm">
            {t.primary || 'Primary'}
          </Badge>
        )}
      </span>
    ),
    content: (
      <TenantRoleEditor
        userId={id!}
        assignment={assignment}
        availableRoles={availableRoles}
        onUpdate={() => loadUser(id!)}
        onRemove={() => handleRemoveTenant(assignment.tenantId)}
        t={t}
      />
    ),
  }));

  const availableTenants = getAvailableTenants();

  return (
    <AuthorizedComponent permissions="user.manage">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.manageTenants || 'Manage Tenants'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.username} ({user.email})
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/users/${id}`)}
              >
                {t.back}
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                disabled={availableTenants.length === 0}
              >
                {t.addTenant || 'Add Tenant'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {user.tenantAssignments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>{t.noTenantAssignments || 'No tenant assignments'}</p>
              <Button
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
                disabled={availableTenants.length === 0}
              >
                {t.addTenant || 'Add Tenant'}
              </Button>
            </div>
          ) : (
            <Tabs tabs={tenantTabs} />
          )}
        </div>

        {/* Add Tenant Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedTenantId('');
            setSelectedRoles([]);
          }}
          title={t.addTenant || 'Add Tenant'}
        >
          <div className="space-y-4">
            <Select
              label={t.selectTenant || 'Select Tenant'}
              options={[
                { value: '', label: t.selectTenant || 'Select tenant...' },
                ...availableTenants.map(tenant => ({
                  value: tenant.id,
                  label: tenant.name,
                })),
              ]}
              value={selectedTenantId}
              onChange={setSelectedTenantId}
            />

            <MultiSelect
              label={t.selectRoles || 'Select Roles'}
              options={availableRoles}
              value={selectedRoles}
              onChange={setSelectedRoles}
              placeholder={t.selectRoles || 'Select roles...'}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedTenantId('');
                  setSelectedRoles([]);
                }}
                disabled={adding}
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleAddTenant}
                disabled={adding || !selectedTenantId || selectedRoles.length === 0}
              >
                {adding ? t.adding || 'Adding...' : t.add}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthorizedComponent>
  );
};

/**
 * Tenant Role Editor Component
 * Edit roles and permissions for a specific tenant
 */
interface TenantRoleEditorProps {
  userId: string;
  assignment: UserDetail['tenantAssignments'][0];
  availableRoles: { value: string; label: string }[];
  onUpdate: () => void;
  onRemove: () => void;
  t: Translations;
}

const TenantRoleEditor: React.FC<TenantRoleEditorProps> = ({
  userId,
  assignment,
  availableRoles,
  onUpdate,
  onRemove,
  t,
}) => {
  const [roles, setRoles] = useState<string[]>(assignment.roles);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (roles.length === 0) {
      alert(t.pleaseSelectAtLeastOneRole || 'Please select at least one role');
      return;
    }
    
    try {
      setSaving(true);
      await updateUserTenantRoles(userId, assignment.tenantId, roles);
      onUpdate();
      alert(t.rolesUpdated || 'Roles updated successfully');
    } catch (err: any) {
      console.error('Failed to update roles:', err);
      alert(err.response?.data?.message || t.updateRolesFailed || 'Failed to update roles');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {t.tenantInformation || 'Tenant Information'}
        </h3>
        <div className="bg-gray-50 rounded p-4 space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t.tenantName}:
            </label>
            <p className="text-gray-900">{assignment.tenantName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t.status}:
            </label>
            <Badge variant={assignment.isPrimary ? 'info' : 'default'}>
              {assignment.isPrimary ? t.primaryTenant || 'Primary' : t.secondary || 'Secondary'}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <MultiSelect
          label={t.roles}
          options={availableRoles}
          value={roles}
          onChange={setRoles}
          placeholder={t.selectRoles || 'Select roles...'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.currentPermissions || 'Current Permissions'}
        </label>
        <div className="flex flex-wrap gap-1 bg-gray-50 rounded p-4 min-h-[60px]">
          {assignment.permissions.length === 0 ? (
            <span className="text-gray-400 text-sm">
              {t.noPermissions}
            </span>
          ) : (
            assignment.permissions.map((permission) => (
              <Badge key={permission} variant="default" size="sm">
                {permission}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="danger"
          onClick={onRemove}
        >
          {t.removeTenant || 'Remove Tenant'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || roles.length === 0}
        >
          {saving ? t.saving : t.saveChanges || 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default UserTenantsPage;

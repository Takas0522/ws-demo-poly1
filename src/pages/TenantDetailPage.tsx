import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTenantById,
  updateTenant,
  deleteTenant,
  assignTenantAdmin,
  removeTenantAdmin,
  getAvailableUsers,
} from '../api/tenantApi';
import { TenantDetail, TenantStatus, SubscriptionPlan, UserListItem } from '../types/tenant';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * Tenant Detail/Edit Page
 * Allows viewing and editing tenant information, managing subscriptions,
 * configuring allowed domains, and assigning admins
 */
const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [status, setStatus] = useState<TenantStatus>('active');
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');

  // Admin assignment modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserListItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load tenant data
  useEffect(() => {
    if (!id) return;
    
    const loadTenant = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTenantById(id);
        
        // Check if data has expected structure
        if (data && data.subscription && data.allowedDomains !== undefined) {
          setTenant(data);
          setName(data.name);
          setStatus(data.status);
          setPlan(data.subscription.plan);
          setStartDate(data.subscription.startDate);
          setEndDate(data.subscription.endDate || '');
          setAllowedDomains(data.allowedDomains);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        console.error('Failed to load tenant:', err);
        // Use mock data when API is not available
        const mockTenant: TenantDetail = {
          id: id || 'mock-1',
          name: 'Acme Corporation',
          status: 'active',
          subscription: {
            plan: 'enterprise',
            startDate: '2024-01-15',
            endDate: '2025-01-15',
            features: ['API Access', 'Priority Support', 'Custom Branding'],
          },
          allowedDomains: ['acme.com', 'acmecorp.com'],
          adminIds: ['admin-1', 'admin-2'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        };
        setTenant(mockTenant);
        setName(mockTenant.name);
        setStatus(mockTenant.status);
        setPlan(mockTenant.subscription.plan);
        setStartDate(mockTenant.subscription.startDate);
        setEndDate(mockTenant.subscription.endDate || '');
        setAllowedDomains(mockTenant.allowedDomains);
        setError('Using mock data - Backend API not available');
      } finally {
        setLoading(false);
      }
    };

    loadTenant();
  }, [id]);

  // Load available users when modal opens
  useEffect(() => {
    if (showAdminModal) {
      loadAvailableUsers();
    }
  }, [showAdminModal, userSearch]);

  const loadAvailableUsers = async () => {
    try {
      const users = await getAvailableUsers(userSearch || undefined);
      setAvailableUsers(users);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleSave = async () => {
    if (!id || !tenant) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await updateTenant(id, {
        name,
        status,
        subscription: {
          plan,
          startDate,
          endDate: endDate || undefined,
        },
        allowedDomains,
      });

      setSuccessMessage(t.tenantUpdatedSuccessfully);
      
      // Reload tenant data
      const updatedTenant = await getTenantById(id);
      setTenant(updatedTenant);
    } catch (err) {
      console.error('Failed to update tenant:', err);
      setError(t.failedToUpdateTenant);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain));
  };

  const handleAssignAdmin = async () => {
    if (!id || !selectedUserId) return;

    try {
      await assignTenantAdmin(id, selectedUserId);
      setSuccessMessage(t.adminAssignedSuccessfully);
      setShowAdminModal(false);
      setSelectedUserId('');
      
      // Reload tenant data
      const updatedTenant = await getTenantById(id);
      setTenant(updatedTenant);
    } catch (err) {
      console.error('Failed to assign admin:', err);
      setError(t.failedToAssignAdmin);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!id) return;

    try {
      await removeTenantAdmin(id, userId);
      setSuccessMessage(t.adminRemovedSuccessfully);
      
      // Reload tenant data
      const updatedTenant = await getTenantById(id);
      setTenant(updatedTenant);
    } catch (err) {
      console.error('Failed to remove admin:', err);
      setError(t.failedToRemoveAdmin);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteTenant(id);
      navigate('/admin/tenants');
    } catch (err) {
      console.error('Failed to delete tenant:', err);
      setError(t.failedToDeleteTenant);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error">Tenant not found</Alert>
      </div>
    );
  }

  return (
    <AuthorizedComponent permissions="global.admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t.tenantDetails}</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/admin/tenants')}>
                {t.back}
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                {t.delete}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-4" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t.basicInformation}</h2>
            <div className="space-y-4">
              <Input
                label={t.tenantName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.enterTenantName}
              />
              <Select
                label={t.status}
                options={[
                  { value: 'active', label: t.active },
                  { value: 'inactive', label: t.inactive },
                  { value: 'suspended', label: t.suspended },
                ]}
                value={status}
                onChange={(value) => setStatus(value as TenantStatus)}
              />
            </div>
          </Card>

          {/* Subscription Management */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t.subscriptionManagement}</h2>
            <div className="space-y-4">
              <Select
                label={t.plan}
                options={[
                  { value: 'free', label: t.free },
                  { value: 'basic', label: t.basic },
                  { value: 'premium', label: t.premium },
                  { value: 'enterprise', label: t.enterprise },
                ]}
                value={plan}
                onChange={(value) => setPlan(value as SubscriptionPlan)}
              />
              <Input
                label={t.startDate}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label={t.endDate}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                helperText={t.optional}
              />
            </div>
          </Card>

          {/* Allowed Domains */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t.allowedDomains}</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder={t.enterDomain}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                />
                <Button onClick={handleAddDomain}>{t.add}</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allowedDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="info"
                    className="flex items-center gap-2"
                  >
                    {domain}
                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {allowedDomains.length === 0 && (
                <p className="text-sm text-gray-500">{t.noDomains}</p>
              )}
            </div>
          </Card>

          {/* Tenant Admins */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t.tenantAdmins}</h2>
              <Button size="sm" onClick={() => setShowAdminModal(true)}>
                {t.assignAdmin}
              </Button>
            </div>
            <div className="space-y-2">
              {tenant.adminIds.length === 0 ? (
                <p className="text-sm text-gray-500">{t.noAdmins}</p>
              ) : (
                tenant.adminIds.map((adminId) => (
                  <div
                    key={adminId}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span>{adminId}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveAdmin(adminId)}
                    >
                      {t.remove}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/tenants')}>
              {t.cancel}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t.saving : t.save}
            </Button>
          </div>
        </div>

        {/* Admin Assignment Modal */}
        <Modal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          title={t.assignAdmin}
        >
          <div className="space-y-4">
            <Input
              placeholder={t.searchUsers}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedUserId === user.id
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAdminModal(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleAssignAdmin} disabled={!selectedUserId}>
                {t.assign}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t.confirmDelete}
        >
          <div className="space-y-4">
            <p>{t.confirmDeleteMessage}</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                {t.cancel}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                {t.delete}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthorizedComponent>
  );
};

export default TenantDetailPage;

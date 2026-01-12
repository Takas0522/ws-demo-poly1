import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenant } from '../api/tenantApi';
import { TenantStatus, SubscriptionPlan } from '../types/tenant';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * Tenant Create Page
 * Form for creating new tenants with validation and confirmation
 */
const TenantCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [status, setStatus] = useState<TenantStatus>('active');
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t.tenantNameRequired;
    }

    if (!startDate) {
      newErrors.startDate = t.startDateRequired;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = t.endDateMustBeAfterStart;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      // Basic domain validation
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/.test(newDomain)) {
        setErrors({ ...errors, domain: t.invalidDomainFormat });
        return;
      }
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain('');
      setErrors({ ...errors, domain: '' });
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmCreate = async () => {
    try {
      setCreating(true);
      setError(null);

      const tenant = await createTenant({
        name,
        status,
        subscription: {
          plan,
          startDate,
          endDate: endDate || undefined,
        },
        allowedDomains,
      });

      // Navigate to the created tenant's detail page
      navigate(`/admin/tenants/${tenant.id}`);
    } catch (err) {
      console.error('Failed to create tenant:', err);
      setError('Failed to create tenant. Please try again.');
      setShowConfirmModal(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AuthorizedComponent permissions="global.admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t.createTenant}</h1>
            <Button variant="secondary" onClick={() => navigate('/admin/tenants')}>
              {t.cancel}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">{t.basicInformation}</h2>
              <div className="space-y-4">
                <Input
                  label={t.tenantName}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  placeholder={t.enterTenantName}
                  error={errors.name}
                  required
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

            {/* Subscription */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">{t.subscription}</h2>
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
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) {
                      setErrors({ ...errors, startDate: '' });
                    }
                  }}
                  error={errors.startDate}
                  required
                />
                <Input
                  label={t.endDate}
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) {
                      setErrors({ ...errors, endDate: '' });
                    }
                  }}
                  error={errors.endDate}
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
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      if (errors.domain) {
                        setErrors({ ...errors, domain: '' });
                      }
                    }}
                    placeholder={t.enterDomain}
                    error={errors.domain}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDomain())}
                  />
                  <Button type="button" onClick={handleAddDomain}>
                    {t.add}
                  </Button>
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
                        type="button"
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

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/tenants')}
              >
                {t.cancel}
              </Button>
              <Button type="submit">
                {t.create}
              </Button>
            </div>
          </div>
        </form>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => !creating && setShowConfirmModal(false)}
          title={t.confirmCreateTenant}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">{t.confirmCreateMessage}</p>
              <div className="bg-gray-50 p-4 rounded space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{t.tenantName}:</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.status}:</span>
                  <span>{status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.plan}:</span>
                  <span>{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.startDate}:</span>
                  <span>{startDate}</span>
                </div>
                {endDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">{t.endDate}:</span>
                    <span>{endDate}</span>
                  </div>
                )}
                {allowedDomains.length > 0 && (
                  <div>
                    <span className="font-medium">{t.allowedDomains}:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {allowedDomains.map((domain) => (
                        <Badge key={domain} variant="info">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={creating}
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleConfirmCreate}
                disabled={creating}
              >
                {creating ? t.creating : t.confirm}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthorizedComponent>
  );
};

export default TenantCreatePage;

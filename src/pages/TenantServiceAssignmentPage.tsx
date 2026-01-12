import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServices } from '../api/serviceApi';
import { getTenantServices, updateTenantService, toggleTenantServiceFeature } from '../api/serviceApi';
import { getTenantById } from '../api/tenantApi';
import { Service, TenantServiceConfig, TenantServiceAssignment } from '../types/service';
import { TenantDetail, SubscriptionPlan } from '../types/tenant';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';

/**
 * Tenant Service Assignment Page
 * Allows enabling/disabling services and feature flags for a specific tenant
 */
const TenantServiceAssignmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [tenantServices, setTenantServices] = useState<TenantServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load data
  const loadData = async () => {
    if (!id) {
      setError('Tenant ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Load tenant, services, and tenant service configuration
      const [tenantData, servicesData, tenantServicesData] = await Promise.all([
        getTenantById(id),
        getServices(),
        getTenantServices(id),
      ]);
      
      setTenant(tenantData);
      setServices(servicesData);
      setTenantServices(tenantServicesData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const isServiceEnabled = (serviceId: string): boolean => {
    if (!tenantServices) return false;
    const assignment = tenantServices.assignments.find(a => a.serviceId === serviceId);
    return assignment?.enabled || false;
  };

  const getServiceAssignment = (serviceId: string): TenantServiceAssignment | undefined => {
    return tenantServices?.assignments.find(a => a.serviceId === serviceId);
  };

  const isFeatureEnabled = (serviceId: string, featureId: string): boolean => {
    const assignment = getServiceAssignment(serviceId);
    return assignment?.enabledFeatures.includes(featureId) || false;
  };

  const canUseService = (service: Service): boolean => {
    if (!tenant) return false;
    
    const planHierarchy: SubscriptionPlan[] = ['free', 'basic', 'premium', 'enterprise'];
    const requiredPlanIndex = planHierarchy.indexOf(service.requiredPlan as SubscriptionPlan);
    const tenantPlanIndex = planHierarchy.indexOf(tenant.subscription.plan);
    
    // Allow "professional" to be treated as between "basic" and "premium"
    if (service.requiredPlan === 'professional') {
      return tenantPlanIndex >= 1; // basic or higher
    }
    
    return tenantPlanIndex >= requiredPlanIndex;
  };

  const handleServiceToggle = async (serviceId: string, enabled: boolean) => {
    if (!id) return;

    try {
      setError(null);
      const result = await updateTenantService(id, serviceId, enabled);
      setTenantServices(result);
      setSuccessMessage(enabled ? t.serviceEnabled : t.serviceDisabled);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to toggle service:', err);
      setError(t.serviceUpdateFailed);
    }
  };

  const handleFeatureToggle = async (serviceId: string, featureId: string, enabled: boolean) => {
    if (!id) return;

    try {
      setError(null);
      const result = await toggleTenantServiceFeature(id, serviceId, featureId, enabled);
      setTenantServices(result);
      setSuccessMessage(t.serviceUpdatedSuccessfully);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to toggle feature:', err);
      setError(t.serviceUpdateFailed);
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free':
        return t.free;
      case 'basic':
        return t.basic;
      case 'professional':
        return t.professional;
      case 'premium':
        return t.premium;
      case 'enterprise':
        return t.enterprise;
      default:
        return plan;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="danger">Tenant not found</Alert>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: t.tenantManagement, path: '/admin/tenants' },
    { label: tenant.name, path: `/admin/tenants/${id}` },
    { label: t.serviceAssignment },
  ];

  return (
    <AuthorizedComponent permissions="global.admin">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.tenantServiceAssignment}</h1>
              <p className="text-gray-600 mt-2">
                {tenant.name} - {getPlanLabel(tenant.subscription.plan)} {t.plan}
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate(`/admin/tenants/${id}`)}>
              {t.back}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const enabled = isServiceEnabled(service.id);
            const canUse = canUseService(service);
            const assignment = getServiceAssignment(service.id);

            return (
              <Card key={service.id}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    </div>
                    <Toggle
                      checked={enabled}
                      onChange={(checked) => handleServiceToggle(service.id, checked)}
                      disabled={!canUse}
                    />
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{t.requiredPlan}:</span>{' '}
                      <span className={canUse ? 'text-green-600' : 'text-red-600'}>
                        {getPlanLabel(service.requiredPlan)}以上
                      </span>
                    </p>
                    {!canUse && (
                      <p className="text-sm text-red-600 mt-1">
                        ⚠️ {t.upgradeRequired}
                      </p>
                    )}
                  </div>

                  {/* Feature Flags */}
                  {enabled && service.features.length > 0 && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{t.featureFlags}</h4>
                      <div className="space-y-2">
                        {service.features.map((feature) => {
                          const featureEnabled = isFeatureEnabled(service.id, feature.id);
                          return (
                            <div key={feature.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                <p className="text-xs text-gray-600">{feature.description}</p>
                              </div>
                              <Toggle
                                checked={featureEnabled}
                                onChange={(checked) => handleFeatureToggle(service.id, feature.id, checked)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {enabled && assignment?.assignedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Assigned: {new Date(assignment.assignedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AuthorizedComponent>
  );
};

export default TenantServiceAssignmentPage;

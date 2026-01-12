import React, { useState, useEffect } from 'react';
import { getServices } from '../api/serviceApi';
import { Service, ServiceCategory, ServiceStatus } from '../types/service';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';
import { getPlanLabel } from '../utils/planUtils';

/**
 * Service Catalog Page
 * Displays all available services in a card layout with filtering
 */
const ServiceCatalogPage: React.FC = () => {
  const { t } = useI18n();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | ''>('');
  
  // Modal
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load services
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getServices({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [search, categoryFilter, statusFilter]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const getStatusBadgeVariant = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'beta':
        return 'warning';
      case 'coming_soon':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return t.available;
      case 'beta':
        return t.beta;
      case 'coming_soon':
        return t.comingSoon;
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: ServiceCategory) => {
    switch (category) {
      case 'storage':
        return t.storage;
      case 'communication':
        return t.communication;
      case 'analytics':
        return t.analytics;
      case 'security':
        return t.security;
      case 'integration':
        return t.integration;
      default:
        return category;
    }
  };

  const getPlanLabelText = (plan: string) => {
    return getPlanLabel(plan, t);
  };

  return (
    <AuthorizedComponent permissions="global.admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.serviceCatalog}</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              type="text"
              placeholder={t.searchServices}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: t.allCategories },
                { value: 'storage', label: t.storage },
                { value: 'communication', label: t.communication },
                { value: 'analytics', label: t.analytics },
                { value: 'security', label: t.security },
                { value: 'integration', label: t.integration },
              ]}
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value as ServiceCategory | '')}
            />
            <Select
              options={[
                { value: '', label: t.allStatuses },
                { value: 'available', label: t.available },
                { value: 'beta', label: t.beta },
                { value: 'coming_soon', label: t.comingSoon },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as ServiceStatus | '')}
            />
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t.noServicesFound}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleServiceClick(service)}
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <Badge variant={getStatusBadgeVariant(service.status)}>
                      {getStatusLabel(service.status)}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="default">{getCategoryLabel(service.category)}</Badge>
                    {service.version && (
                      <Badge variant="secondary">v{service.version}</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{t.requiredPlan}:</span>{' '}
                      <span className="text-primary-600 font-semibold">
                        {getPlanLabelText(service.requiredPlan)}{t.orHigher}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Service Detail Modal */}
        {selectedService && (
          <Modal isOpen={modalOpen} onClose={closeModal} title={t.serviceDetails}>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedService.name}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge variant={getStatusBadgeVariant(selectedService.status)}>
                    {getStatusLabel(selectedService.status)}
                  </Badge>
                  <Badge variant="default">{getCategoryLabel(selectedService.category)}</Badge>
                  {selectedService.version && (
                    <Badge variant="secondary">{t.version}: {selectedService.version}</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-4">{selectedService.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t.requiredPlan}: <span className="text-primary-600">{getPlanLabelText(selectedService.requiredPlan)}{t.orHigher}</span>
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t.features}</h4>
                <div className="space-y-2">
                  {selectedService.features.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{feature.name}</span>
                          {feature.enabled && (
                            <Badge variant="success" className="text-xs">{t.enabled}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button onClick={closeModal} variant="secondary">
                  {t.closeDetails}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AuthorizedComponent>
  );
};

export default ServiceCatalogPage;

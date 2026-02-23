"use client";

import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { TenantServiceFeature } from "@/types";
import { useEffect, useState } from "react";

interface Service {
  service_id: string;
  service_name: string;
  description?: string;
  created_at: string;
  available_roles: Array<{
    role_code: string;
    role_name: string;
  }>;
}

interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

interface TenantService {
  service_id: string;
  service_name: string;
  assigned_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [tenantServices, setTenantServices] = useState<TenantService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["global_admin", "admin"]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [serviceFeatures, setServiceFeatures] = useState<Record<string, TenantServiceFeature[]>>({});
  const [featureLoading, setFeatureLoading] = useState<string | null>(null);
  const [togglingFeature, setTogglingFeature] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
    fetchTenants();
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      fetchTenantServices(selectedTenant);
    }
    setExpandedService(null);
    setServiceFeatures({});
  }, [selectedTenant]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/services");

      if (!response.ok) {
        throw new Error("サービスの取得に失敗しました");
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenants");
      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants || []);
      }
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
    }
  };

  const fetchTenantServices = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}/services`);

      if (response.ok) {
        const data = await response.json();
        setTenantServices(data.services || []);
      }
    } catch (err) {
      console.error("Failed to fetch tenant services:", err);
      setTenantServices([]);
    }
  };

  const isServiceAssigned = (serviceId: string): boolean => {
    return tenantServices.some((ts) => ts.service_id === serviceId);
  };

  const fetchServiceFeatures = async (serviceId: string, forceRefresh = false) => {
    if (!forceRefresh && serviceFeatures[serviceId]) {
      return;
    }
    try {
      setFeatureLoading(serviceId);
      const response = await fetch(`/api/tenants/${selectedTenant}/services/${serviceId}/features`);
      if (!response.ok) {
        throw new Error("機能設定の取得に失敗しました");
      }
      const data = await response.json();
      setServiceFeatures(prev => ({ ...prev, [serviceId]: data.features || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setFeatureLoading(null);
    }
  };

  const handleToggleFeature = async (serviceId: string, featureId: string, currentEnabled: boolean) => {
    try {
      setTogglingFeature(featureId);
      const response = await fetch(
        `/api/tenants/${selectedTenant}/services/${serviceId}/features/${featureId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_enabled: !currentEnabled }),
        }
      );
      if (!response.ok) {
        throw new Error("機能設定の更新に失敗しました");
      }
      await fetchServiceFeatures(serviceId, true);
      setSuccess("機能設定を更新しました");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setTogglingFeature(null);
    }
  };

  const handleToggleExpand = (serviceId: string) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceId);
      fetchServiceFeatures(serviceId);
    }
  };

  const handleAssignService = async (serviceId: string) => {
    if (!selectedTenant) {
      setError("テナントを選択してください");
      return;
    }

    try {
      const response = await fetch(`/api/tenants/${selectedTenant}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service_id: serviceId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error?.message || "サービスの割り当てに失敗しました",
        );
      }

      setSuccess("サービスを割り当てました");
      await fetchTenantServices(selectedTenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  const handleUnassignService = async (serviceId: string) => {
    if (!selectedTenant) {
      return;
    }

    if (!confirm("このサービスの割り当てを解除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/tenants/${selectedTenant}/services/${serviceId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error?.message || "サービスの割り当て解除に失敗しました",
        );
      }

      setSuccess("サービスの割り当てを解除しました");
      await fetchTenantServices(selectedTenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">サービス設定</h1>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        {/* Tenant Selector */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <label
            htmlFor="tenant_select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            テナントを選択
          </label>
          <select
            id="tenant_select"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">テナントを選択してください</option>
            {tenants.map((tenant) => (
              <option key={tenant.tenant_id} value={tenant.tenant_id}>
                {tenant.tenant_name}
              </option>
            ))}
          </select>
        </div>

        {/* Services List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              利用可能なサービス
            </h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  サービス名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  利用可能なロール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    サービスがありません
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const assigned = isServiceAssigned(service.service_id);
                  const isExpanded = expandedService === service.service_id;
                  const features = serviceFeatures[service.service_id] || [];
                  const isLoadingFeatures = featureLoading === service.service_id;
                  return (
                    <React.Fragment key={service.service_id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {selectedTenant && assigned && (
                              <button
                                onClick={() => handleToggleExpand(service.service_id)}
                                aria-expanded={isExpanded}
                                aria-label={`${service.service_name}の機能設定を${isExpanded ? "閉じる" : "展開する"}`}
                                className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                              >
                                {isExpanded ? "▼" : "▶"}
                              </button>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {service.service_name}
                              </div>
                              {service.description && (
                                <div className="text-sm text-gray-600">
                                  {service.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {service.available_roles?.map((role) => (
                              <span
                                key={role.role_code}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {role.role_name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedTenant ? (
                            assigned ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                割り当て済み
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                未割り当て
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-gray-600">
                              テナント未選択
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {selectedTenant &&
                            (assigned ? (
                              <button
                                onClick={() =>
                                  handleUnassignService(service.service_id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                割り当て解除
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAssignService(service.service_id)
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                割り当て
                              </button>
                            ))}
                        </td>
                      </tr>

                      {/* Feature accordion row */}
                      {isExpanded && assigned && (
                        <tr>
                          <td colSpan={4} className="px-6 py-0">
                            <div className="py-4 pl-8 pr-4 bg-gray-50 rounded-lg my-2">
                              <h3 className="text-sm font-semibold text-gray-700 mb-3">機能設定</h3>
                              {isLoadingFeatures ? (
                                <div className="flex items-center py-4">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                  <span className="text-sm text-gray-600">読み込み中...</span>
                                </div>
                              ) : features.length === 0 ? (
                                <p className="text-sm text-gray-600 py-2">このサービスには設定可能な機能がありません</p>
                              ) : (
                                <table className="min-w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">機能名</th>
                                      <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">説明</th>
                                      <th className="text-center text-xs font-medium text-gray-500 uppercase pb-2">ステータス</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {features.map((feature) => (
                                      <tr key={feature.feature_id}>
                                        <td className="py-2 pr-4 text-sm text-gray-900">{feature.feature_name}</td>
                                        <td className="py-2 pr-4 text-sm text-gray-600">{feature.description}</td>
                                        <td className="py-2 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              onClick={() => handleToggleFeature(service.service_id, feature.feature_id, feature.is_enabled)}
                                              disabled={!isAdmin || togglingFeature === feature.feature_id}
                                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                feature.is_enabled ? "bg-blue-600" : "bg-gray-300"
                                              } ${(!isAdmin || togglingFeature === feature.feature_id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                              {togglingFeature === feature.feature_id ? (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                </span>
                                              ) : (
                                                <span
                                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    feature.is_enabled ? "translate-x-6" : "translate-x-1"
                                                  }`}
                                                />
                                              )}
                                            </button>
                                            <span className={`text-xs font-medium ${feature.is_enabled ? "text-blue-600" : "text-gray-500"}`}>
                                              {feature.is_enabled ? "ON" : "OFF"}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              feature.is_default
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-blue-100 text-blue-700"
                                            }`}>
                                              {feature.is_default ? "デフォルト" : "カスタム設定"}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Assigned Services for Selected Tenant */}
        {selectedTenant && tenantServices.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900">
                割り当て済みサービス
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {tenantServices.map((service) => (
                  <div
                    key={service.service_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {service.service_name}
                      </span>
                      <span className="ml-2 text-xs text-gray-600">
                        割り当て日:{" "}
                        {new Date(service.assigned_at).toLocaleString("ja-JP")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

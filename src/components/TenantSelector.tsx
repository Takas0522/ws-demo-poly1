import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Tenant Selector Component
 * 
 * Displays a dropdown to switch between available tenants.
 * Shows the currently selected tenant and allows switching to others.
 */
export const TenantSelector: React.FC = () => {
  const { user, selectedTenant, tenants, switchTenant, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if user is not authenticated or has no tenants
  if (!user || tenants.length === 0) {
    return null;
  }

  const handleTenantSwitch = async (tenantId: string) => {
    setIsOpen(false);
    try {
      await switchTenant(tenantId);
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      // Error is already logged in AuthContext
    }
  };

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Building Icon (SVG) */}
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          {selectedTenant?.name || 'テナント選択'}
        </span>
        {/* Chevron Down Icon */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {tenants.map((tenant) => {
                const isActive = selectedTenant?.id === tenant.id;
                return (
                  <button
                    key={tenant.id}
                    onClick={() => handleTenantSwitch(tenant.id)}
                    disabled={isActive}
                    className={`flex flex-col w-full px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-primary-50 cursor-default'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isActive ? 'text-primary-600' : 'text-gray-900'}`}>
                        {tenant.name}
                      </span>
                      {isActive && (
                        <svg
                          className="w-5 h-5 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {tenant.roles.join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

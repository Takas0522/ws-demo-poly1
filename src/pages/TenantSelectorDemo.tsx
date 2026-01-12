import React from 'react';
import { TenantSelector } from '../components/TenantSelector';

/**
 * Test page to demonstrate the Tenant Selector component
 */
const TenantSelectorDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tenant Selector Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Header with Tenant Selector
          </h2>
          <p className="text-gray-600 mb-6">
            This simulates the header bar with the tenant selector component.
            Note: This requires a logged-in user with tenants to display properly.
          </p>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                ☰ Menu
              </button>
              <TenantSelector />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The tenant selector will only appear when:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>User is authenticated</li>
              <li>User has at least one tenant assigned</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Login Page Preview
          </h2>
          <p className="text-gray-600 mb-4">
            Navigate to <code className="px-2 py-1 bg-gray-100 rounded">/login</code> to see the login page.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default TenantSelectorDemo;

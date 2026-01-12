import apiClient from './apiClient';
import { SearchResponse, SearchFilters, SearchResult } from '../types/search';
import { getTenants } from './tenantApi';
import { getUsers } from './userApi';
import { getServices } from './serviceApi';

/**
 * Search API Client
 * Provides global search functionality across all entities
 */

/**
 * Perform global search across all entities
 */
export const globalSearch = async (filters: SearchFilters): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get<SearchResponse>('/search', { 
      params: filters 
    });
    
    // Validate response structure
    if (response.data && 
        response.data.results && 
        Array.isArray(response.data.results) &&
        response.data.categories) {
      return response.data;
    } else {
      // If structure is invalid, use client-side search
      console.warn('Invalid search API response, using client-side search');
      return performClientSideSearch(filters);
    }
  } catch (error) {
    console.warn('API not available, using mock search');
    // Fallback to client-side search using existing APIs
    return performClientSideSearch(filters);
  }
};

/**
 * Perform client-side search when API is not available
 */
async function performClientSideSearch(filters: SearchFilters): Promise<SearchResponse> {
  const { query, category = 'all', limit = 20 } = filters;
  const searchLower = query.toLowerCase();
  const results: SearchResult[] = [];
  
  const categories = {
    tenant: 0,
    user: 0,
    service: 0,
  };

  // Search tenants
  if (category === 'all' || category === 'tenant') {
    try {
      const tenantsResponse = await getTenants({ search: query, perPage: limit });
      const tenantResults = tenantsResponse.items
        .filter(tenant => 
          tenant.name.toLowerCase().includes(searchLower) ||
          tenant.id.toLowerCase().includes(searchLower)
        )
        .slice(0, Math.floor(limit / 3))
        .map(tenant => ({
          id: tenant.id,
          category: 'tenant' as const,
          title: tenant.name,
          subtitle: `${tenant.status} • ${tenant.plan}`,
          description: `Created: ${new Date(tenant.createdAt).toLocaleDateString()}`,
          path: `/admin/tenants/${tenant.id}`,
          status: tenant.status,
          plan: tenant.plan,
        }));
      
      results.push(...tenantResults);
      categories.tenant = tenantResults.length;
    } catch (error) {
      console.warn('Failed to search tenants', error);
    }
  }

  // Search users
  if (category === 'all' || category === 'user') {
    try {
      const usersResponse = await getUsers({ search: query, perPage: limit });
      const userResults = usersResponse.items
        .filter(user => 
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
        )
        .slice(0, Math.floor(limit / 3))
        .map(user => ({
          id: user.id,
          category: 'user' as const,
          title: user.username,
          subtitle: user.email,
          description: `${user.userType} • ${user.status}`,
          path: `/admin/users/${user.id}`,
          email: user.email,
          userType: user.userType,
          status: user.status,
        }));
      
      results.push(...userResults);
      categories.user = userResults.length;
    } catch (error) {
      console.warn('Failed to search users', error);
    }
  }

  // Search services
  if (category === 'all' || category === 'service') {
    try {
      const services = await getServices({ search: query });
      const serviceResults = services
        .filter(service => 
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.id.toLowerCase().includes(searchLower)
        )
        .slice(0, Math.floor(limit / 3))
        .map(service => ({
          id: service.id,
          category: 'service' as const,
          title: service.name,
          subtitle: service.category,
          description: service.description,
          path: `/admin/services`,
          serviceCategory: service.category,
          status: service.status,
        }));
      
      results.push(...serviceResults);
      categories.service = serviceResults.length;
    } catch (error) {
      console.warn('Failed to search services', error);
    }
  }

  return {
    results: results.slice(0, limit),
    total: results.length,
    categories,
  };
}

/**
 * Get search suggestions based on partial query
 */
export const getSearchSuggestions = async (query: string, limit: number = 5): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/search/suggestions', {
      params: { query, limit }
    });
    return response.data;
  } catch (error) {
    // Return empty array if API not available
    return [];
  }
};

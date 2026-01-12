import { SavedFilter, FilterType, TenantSavedFilter, UserSavedFilter, ServiceSavedFilter } from '../types/filters';

/**
 * Saved Filters Utility
 * Manages filter persistence in localStorage
 */

const STORAGE_KEY = 'saved_filters';

/**
 * Get all saved filters
 */
export const getSavedFilters = (): SavedFilter[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SavedFilter[];
    }
  } catch (error) {
    console.error('Failed to load saved filters:', error);
  }
  return [];
};

/**
 * Get saved filters by type
 */
export const getSavedFiltersByType = (type: FilterType): SavedFilter[] => {
  const filters = getSavedFilters();
  return filters.filter(f => f.type === type);
};

/**
 * Get saved filter by ID
 */
export const getSavedFilterById = (id: string): SavedFilter | undefined => {
  const filters = getSavedFilters();
  return filters.find(f => f.id === id);
};

/**
 * Save a new filter
 */
export const saveFilter = (filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>): SavedFilter => {
  const filters = getSavedFilters();
  
  const newFilter: SavedFilter = {
    ...filter,
    id: generateFilterId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as SavedFilter;
  
  filters.push(newFilter);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filter:', error);
    throw new Error('Failed to save filter');
  }
  
  return newFilter;
};

/**
 * Update an existing filter
 */
export const updateFilter = (id: string, updates: Partial<Omit<SavedFilter, 'id' | 'createdAt' | 'type'>>): SavedFilter | null => {
  const filters = getSavedFilters();
  const index = filters.findIndex(f => f.id === id);
  
  if (index === -1) {
    return null;
  }
  
  filters[index] = {
    ...filters[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to update filter:', error);
    throw new Error('Failed to update filter');
  }
  
  return filters[index];
};

/**
 * Delete a saved filter
 */
export const deleteFilter = (id: string): boolean => {
  const filters = getSavedFilters();
  const index = filters.findIndex(f => f.id === id);
  
  if (index === -1) {
    return false;
  }
  
  filters.splice(index, 1);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to delete filter:', error);
    throw new Error('Failed to delete filter');
  }
  
  return true;
};

/**
 * Clear all saved filters
 */
export const clearAllFilters = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear filters:', error);
  }
};

/**
 * Clear filters by type
 */
export const clearFiltersByType = (type: FilterType): void => {
  const filters = getSavedFilters();
  const filtered = filters.filter(f => f.type !== type);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to clear filters by type:', error);
  }
};

/**
 * Generate a unique filter ID
 */
function generateFilterId(): string {
  return `filter_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Export filters to JSON
 */
export const exportFilters = (): string => {
  const filters = getSavedFilters();
  return JSON.stringify(filters, null, 2);
};

/**
 * Import filters from JSON
 */
export const importFilters = (json: string, merge: boolean = false): boolean => {
  try {
    const importedFilters = JSON.parse(json) as SavedFilter[];
    
    // Validate imported data
    if (!Array.isArray(importedFilters)) {
      throw new Error('Invalid filter data format');
    }
    
    let filters: SavedFilter[];
    if (merge) {
      const existing = getSavedFilters();
      // Remove duplicates by name and type
      const existingKeys = new Set(existing.map(f => `${f.type}_${f.name}`));
      const newFilters = importedFilters.filter(f => !existingKeys.has(`${f.type}_${f.name}`));
      filters = [...existing, ...newFilters];
    } else {
      filters = importedFilters;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    return true;
  } catch (error) {
    console.error('Failed to import filters:', error);
    return false;
  }
};

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Application state store using Zustand
 * 
 * This provides global state management for:
 * - UI state (sidebar, theme, etc.)
 * - Application settings
 * - Cached data
 */

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Application store with persistence
 * 
 * @example
 * ```tsx
 * const { sidebarOpen, toggleSidebar } = useAppStore();
 * ```
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        theme: 'light',
        
        // Actions
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'app-storage', // localStorage key
        partialize: (state) => ({
          // Only persist these fields
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'AppStore', // DevTools name
    }
  )
);

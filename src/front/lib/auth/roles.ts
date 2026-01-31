// Role utilities for role-based access control

import type { User } from "./types";

/**
 * Role types based on the requirements
 * 全体管理者 (Global Admin) - Full access
 * 管理者 (Admin) - Access to most features except service settings
 * 閲覧者 (Viewer) - Read-only access
 */
export type RoleType = "全体管理者" | "管理者" | "閲覧者";

/**
 * Get all roles for a user across all services
 */
export function getUserRoles(user: User | null): string[] {
  if (!user || !user.roles) {
    return [];
  }

  const allRoles: string[] = [];
  Object.values(user.roles).forEach((roleArray) => {
    allRoles.push(...roleArray);
  });

  return [...new Set(allRoles)]; // Remove duplicates
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: RoleType): boolean {
  const roles = getUserRoles(user);
  return roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: RoleType[]): boolean {
  return roles.some((role) => hasRole(user, role));
}

/**
 * Get the highest privilege role for the user
 * Returns the most privileged role in order: 全体管理者 > 管理者 > 閲覧者
 */
export function getHighestRole(user: User | null): RoleType | null {
  if (hasRole(user, "全体管理者")) {
    return "全体管理者";
  }
  if (hasRole(user, "管理者")) {
    return "管理者";
  }
  if (hasRole(user, "閲覧者")) {
    return "閲覧者";
  }
  return null;
}

/**
 * Check if user can access a specific menu item based on role
 */
export function canAccessMenu(user: User | null, menu: string): boolean {
  const role = getHighestRole(user);

  if (!role) {
    return false;
  }

  switch (menu) {
    case "dashboard":
      // All roles can access dashboard
      return true;

    case "tenant-management":
      // All roles can access tenant management
      return true;

    case "user-management":
      // Only 全体管理者 and 管理者 can access user management
      return role === "全体管理者" || role === "管理者";

    case "service-settings":
      // Only 全体管理者 can access service settings
      return role === "全体管理者";

    default:
      return false;
  }
}

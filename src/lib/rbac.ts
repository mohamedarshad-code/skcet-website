/**
 * User Roles for SKCET Portal
 */
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  EXAM_COORDINATOR = "exam_coordinator",
  FACULTY = "faculty",
  STUDENT = "student",
}

/**
 * Permission definitions for each role
 */
export const RolePermissions = {
  [UserRole.SUPER_ADMIN]: [
    "manage:users",
    "manage:roles",
    "manage:results",
    "manage:admissions",
    "manage:faculty",
    "manage:students",
    "view:analytics",
    "manage:settings",
    "manage:departments",
  ],
  [UserRole.EXAM_COORDINATOR]: [
    "manage:results",
    "view:students",
    "upload:results",
    "publish:results",
    "view:analytics",
  ],
  [UserRole.FACULTY]: [
    "view:students",
    "view:results",
    "update:profile",
    "view:schedule",
  ],
  [UserRole.STUDENT]: [
    "view:results",
    "view:profile",
    "update:profile",
    "view:schedule",
    "apply:admission",
  ],
} as const;

/**
 * Route access control by role
 */
export const RouteAccess = {
  "/admin": [UserRole.SUPER_ADMIN],
  "/admin/dashboard": [UserRole.SUPER_ADMIN],
  "/admin/results": [UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR],
  "/admin/admissions": [UserRole.SUPER_ADMIN],
  "/admin/faculty": [UserRole.SUPER_ADMIN],
  "/admin/students": [UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR],
  "/admin/settings": [UserRole.SUPER_ADMIN],
  "/faculty": [UserRole.FACULTY],
  "/faculty/dashboard": [UserRole.FACULTY],
  "/student": [UserRole.STUDENT],
  "/student/dashboard": [UserRole.STUDENT],
  "/student/results": [UserRole.STUDENT],
} as const;

/**
 * Type for permissions
 */
export type Permission = typeof RolePermissions[UserRole][number];

/**
 * Helper function to check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Helper function to check if a role can access a route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoles = RouteAccess[route as keyof typeof RouteAccess];
  return allowedRoles?.includes(role) ?? false;
}

/**
 * Get redirect URL based on user role
 */
export function getRedirectUrlByRole(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/admin/dashboard";
    case UserRole.EXAM_COORDINATOR:
      return "/admin/results";
    case UserRole.FACULTY:
      return "/faculty/dashboard";
    case UserRole.STUDENT:
      return "/student/dashboard";
    default:
      return "/";
  }
}

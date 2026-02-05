"use client";

import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/lib/rbac";

interface PermissionGateProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGate({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGateProps) {
  const { checkPermission } = useAuth();

  if (!checkPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { UserRole, hasPermission, type Permission } from "@/lib/rbac";

export function useAuth() {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  // Get user role from unsafe metadata
  const userRole = (user?.unsafeMetadata?.role as UserRole) || null;

  // Check if user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  // Role checking helpers
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isExamCoordinator = userRole === UserRole.EXAM_COORDINATOR;
  const isFaculty = userRole === UserRole.FACULTY;
  const isStudent = userRole === UserRole.STUDENT;
  const isAdmin = isSuperAdmin || isExamCoordinator;

  return {
    userId,
    user,
    isLoaded,
    isSignedIn,
    userRole,
    checkPermission,
    isSuperAdmin,
    isExamCoordinator,
    isFaculty,
    isStudent,
    isAdmin,
  };
}

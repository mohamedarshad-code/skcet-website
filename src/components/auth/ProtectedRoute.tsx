"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/lib/rbac";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackUrl = "/" 
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
      router.push(fallbackUrl);
    }
  }, [isLoaded, isSignedIn, userRole, allowedRoles, fallbackUrl, router]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized
  if (!isSignedIn || (userRole && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
}

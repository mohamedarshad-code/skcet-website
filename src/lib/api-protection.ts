import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole, hasPermission, type Permission } from "@/lib/rbac";

/**
 * API route protection helper
 * Use this to protect API routes with role-based access control
 */
export async function protectApiRoute(
  allowedRoles?: UserRole[],
  requiredPermission?: Permission
) {
  const { userId, sessionClaims } = await auth();

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }

  // Get user role from session claims
  const userRole = (sessionClaims?.metadata as { role?: UserRole })?.role;

  if (!userRole) {
    return NextResponse.json(
      { error: "Forbidden - No role assigned" },
      { status: 403 }
    );
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient role permissions" },
      { status: 403 }
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return NextResponse.json(
      { error: "Forbidden - Missing required permission" },
      { status: 403 }
    );
  }

  // Return user info if authorized
  return {
    userId,
    userRole,
    authorized: true,
  };
}

/**
 * Example usage in API route:
 * 
 * export async function GET() {
 *   const authCheck = await protectApiRoute([UserRole.SUPER_ADMIN]);
 *   if (authCheck instanceof NextResponse) return authCheck;
 * 
 *   // Your protected logic here
 *   return NextResponse.json({ data: "Protected data" });
 * }
 */

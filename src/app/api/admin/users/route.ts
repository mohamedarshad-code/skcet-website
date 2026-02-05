import { protectApiRoute } from "@/lib/api-protection";
import { UserRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

/**
 * Example protected API route - Admin only
 * GET /api/admin/users
 */
export async function GET() {
  // Protect route - only super admins can access
  const authCheck = await protectApiRoute([UserRole.SUPER_ADMIN]);
  if (authCheck instanceof NextResponse) return authCheck;

  // Your protected logic here
  // Example: Fetch all users from database
  const users = [
    { id: 1, name: "John Doe", role: "student" },
    { id: 2, name: "Jane Smith", role: "faculty" },
  ];

  return NextResponse.json({
    success: true,
    data: users,
    requestedBy: authCheck.userId,
  });
}

/**
 * Example: Create new user - Admin only
 * POST /api/admin/users
 */
export async function POST(request: Request) {
  const authCheck = await protectApiRoute([UserRole.SUPER_ADMIN]);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await request.json();
    
    // Validate and create user
    // Example logic here
    
    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

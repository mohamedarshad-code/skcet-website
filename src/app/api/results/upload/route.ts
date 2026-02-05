import { protectApiRoute } from "@/lib/api-protection";
import { UserRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

/**
 * Upload student results - Admin and Exam Coordinator only
 * POST /api/results/upload
 */
export async function POST(request: Request) {
  // Allow both super admin and exam coordinator
  const authCheck = await protectApiRoute(
    [UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR],
    "upload:results"
  );
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await request.json();
    const { studentId, semester, marks, subject } = body;

    // Validate required fields
    if (!studentId || !semester || !marks || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Example: Save to database
    // const result = await db.results.create({ ... });

    return NextResponse.json({
      success: true,
      message: "Results uploaded successfully",
      uploadedBy: authCheck.userId,
      role: authCheck.userRole,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload results" },
      { status: 500 }
    );
  }
}

/**
 * Get all results - Admin and Exam Coordinator only
 * GET /api/results/upload
 */
export async function GET() {
  const authCheck = await protectApiRoute(
    [UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR],
    "view:students"
  );
  if (authCheck instanceof NextResponse) return authCheck;

  // Example: Fetch from database
  const results = [
    { id: 1, studentId: "CS001", semester: 1, subject: "Mathematics", marks: 85 },
    { id: 2, studentId: "CS002", semester: 1, subject: "Physics", marks: 92 },
  ];

  return NextResponse.json({
    success: true,
    data: results,
  });
}

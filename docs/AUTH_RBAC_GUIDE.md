# Authentication & RBAC Implementation Guide

## Overview

This document describes the complete authentication and role-based access control (RBAC) system implemented for the SKCET website using Clerk.

## Table of Contents

1. [Authentication Setup](#authentication-setup)
2. [Role Definitions](#role-definitions)
3. [Permission System](#permission-system)
4. [Route Protection](#route-protection)
5. [API Security](#api-security)
6. [Usage Examples](#usage-examples)

---

## Authentication Setup

### Clerk Configuration

The application uses Clerk for authentication with custom branding matching SKCET's design system.

**Environment Variables Required:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Custom Sign-In/Sign-Up Pages

- **Location:** `/sign-in/[[...sign-in]]/page.tsx` and `/sign-up/[[...sign-up]]/page.tsx`
- **Features:**
  - Custom SKCET branding (primary blue #003366, accent orange #FF8C00)
  - Social login support (Google)
  - Responsive design
  - Session persistence
  - Redirect logic based on user role

### Onboarding Flow

After sign-up, users are redirected to `/onboarding` where they select their role:

- Student
- Faculty
- Exam Coordinator
- Super Admin

The selected role is stored in Clerk's `publicMetadata.role`.

---

## Role Definitions

### Available Roles

```typescript
enum UserRole {
  SUPER_ADMIN = "super_admin",
  EXAM_COORDINATOR = "exam_coordinator",
  FACULTY = "faculty",
  STUDENT = "student",
}
```

### Role Hierarchy

1. **Super Admin** - Full system access
2. **Exam Coordinator** - Results and student management
3. **Faculty** - View students and results
4. **Student** - View own results and profile

---

## Permission System

### Permission Structure

Each role has specific permissions defined in `src/lib/rbac.ts`:

```typescript
const RolePermissions = {
  super_admin: [
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
  exam_coordinator: [
    "manage:results",
    "view:students",
    "upload:results",
    "publish:results",
    "view:analytics",
  ],
  faculty: ["view:students", "view:results", "update:profile", "view:schedule"],
  student: [
    "view:results",
    "view:profile",
    "update:profile",
    "view:schedule",
    "apply:admission",
  ],
};
```

### Helper Functions

```typescript
// Check if role has permission
hasPermission(role: UserRole, permission: Permission): boolean

// Check if role can access route
canAccessRoute(role: UserRole, route: string): boolean

// Get redirect URL by role
getRedirectUrlByRole(role: UserRole): string
```

---

## Route Protection

### Middleware Protection

**File:** `src/middleware.ts`

The middleware automatically protects routes based on user roles:

**Public Routes (No Auth Required):**

- `/`
- `/sign-in`, `/sign-up`
- `/about`, `/academics`, `/admissions`, `/placements`, `/contact`
- `/news`, `/facilities`

**Protected Routes:**

- `/admin/*` - Super Admin, Exam Coordinator
- `/faculty/*` - Faculty only
- `/student/*` - Student only

**Redirect Logic:**

- Unauthenticated users → `/sign-in`
- Users without role → `/onboarding`
- Unauthorized access → Role-specific dashboard

### Client-Side Protection

**Component:** `ProtectedRoute`

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/lib/rbac";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

### Permission-Based UI

**Component:** `PermissionGate`

```tsx
import { PermissionGate } from "@/components/auth/PermissionGate";

<PermissionGate permission="manage:results">
  <Button>Upload Results</Button>
</PermissionGate>;
```

---

## API Security

### API Route Protection

**File:** `src/lib/api-protection.ts`

All API routes should use the `protectApiRoute` helper:

```typescript
import { protectApiRoute } from "@/lib/api-protection";
import { UserRole } from "@/lib/rbac";

export async function GET() {
  // Protect with role check
  const authCheck = await protectApiRoute([UserRole.SUPER_ADMIN]);
  if (authCheck instanceof NextResponse) return authCheck;

  // Protected logic here
  return NextResponse.json({ data: "Protected data" });
}
```

### Permission-Based API Protection

```typescript
export async function POST(request: Request) {
  // Protect with both role and permission
  const authCheck = await protectApiRoute(
    [UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR],
    "upload:results",
  );
  if (authCheck instanceof NextResponse) return authCheck;

  // Protected logic here
}
```

---

## Usage Examples

### 1. Protect a Page Component

```tsx
// src/app/admin/dashboard/page.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/lib/rbac";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div>Admin Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

### 2. Check Permissions in Component

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export function ResultsUploadButton() {
  const { checkPermission } = useAuth();

  if (!checkPermission("upload:results")) {
    return null;
  }

  return <Button>Upload Results</Button>;
}
```

### 3. Role-Based Rendering

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export function Dashboard() {
  const { isSuperAdmin, isStudent, userRole } = useAuth();

  if (isSuperAdmin) {
    return <AdminDashboard />;
  }

  if (isStudent) {
    return <StudentDashboard />;
  }

  return <DefaultDashboard />;
}
```

### 4. Protect API Route

```typescript
// src/app/api/admin/settings/route.ts
import { protectApiRoute } from "@/lib/api-protection";
import { UserRole } from "@/lib/rbac";

export async function PUT(request: Request) {
  const authCheck = await protectApiRoute(
    [UserRole.SUPER_ADMIN],
    "manage:settings",
  );
  if (authCheck instanceof NextResponse) return authCheck;

  const body = await request.json();
  // Update settings logic

  return NextResponse.json({ success: true });
}
```

---

## Security Best Practices

1. **Never trust client-side checks alone** - Always validate on the server
2. **Use middleware for route protection** - Prevents unauthorized access before page load
3. **Protect all API routes** - Use `protectApiRoute` helper
4. **Store roles in Clerk metadata** - Centralized and secure
5. **Validate permissions on every action** - Don't assume role = permission
6. **Log security events** - Track unauthorized access attempts
7. **Use HTTPS in production** - Encrypt all data in transit

---

## Testing Roles

### Setting User Role Manually (Development)

In Clerk Dashboard:

1. Go to Users
2. Select a user
3. Click "Metadata"
4. Add to Public Metadata:

```json
{
  "role": "super_admin"
}
```

### Testing Different Roles

1. Create test accounts for each role
2. Use Clerk's user impersonation feature
3. Test route access and API endpoints
4. Verify permission gates work correctly

---

## Troubleshooting

### Common Issues

**Issue:** User redirected to onboarding after login

- **Solution:** Ensure role is set in `publicMetadata.role`

**Issue:** Middleware not protecting routes

- **Solution:** Check `matcher` config in middleware.ts

**Issue:** API returns 403 Forbidden

- **Solution:** Verify user has required role/permission

**Issue:** Role not updating after change

- **Solution:** Sign out and sign back in to refresh session

---

## Future Enhancements

1. **Audit Logging** - Track all role changes and permission checks
2. **Dynamic Permissions** - Allow admins to customize role permissions
3. **Multi-tenancy** - Support for multiple departments with isolated access
4. **2FA** - Add two-factor authentication for admin roles
5. **Session Management** - Advanced session controls and timeout settings

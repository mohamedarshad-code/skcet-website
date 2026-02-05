# 🔐 SKCET Authentication & RBAC System

## Overview

Complete authentication and role-based access control (RBAC) system for the SKCET website, powered by Clerk.

## ✨ Features

### Authentication

- ✅ Custom-branded sign-in/sign-up pages
- ✅ Social login (Google)
- ✅ Session persistence
- ✅ Secure password management
- ✅ Email verification
- ✅ Post-sign-in redirect logic

### Role-Based Access Control (RBAC)

- ✅ 4 user roles: Super Admin, Exam Coordinator, Faculty, Student
- ✅ Granular permission system
- ✅ Route-level protection (middleware)
- ✅ API endpoint protection
- ✅ Component-level permission gates
- ✅ Role-based UI rendering

## 📁 File Structure

```
src/
├── app/
│   ├── sign-in/[[...sign-in]]/page.tsx    # Custom sign-in page
│   ├── sign-up/[[...sign-up]]/page.tsx    # Custom sign-up page
│   ├── onboarding/page.tsx                 # Role selection page
│   └── api/
│       ├── admin/users/route.ts            # Protected admin API
│       └── results/upload/route.ts         # Protected results API
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx              # Route protection component
│       └── PermissionGate.tsx              # Permission-based rendering
├── hooks/
│   └── useAuth.ts                          # Enhanced auth hook with RBAC
├── lib/
│   ├── rbac.ts                             # Role & permission definitions
│   └── api-protection.ts                   # API route protection helper
└── middleware.ts                           # Route protection middleware
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @clerk/nextjs
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Add your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test Authentication

1. Navigate to `http://localhost:3000/sign-up`
2. Create an account
3. Select your role on the onboarding page
4. You'll be redirected to your role-specific dashboard

## 👥 User Roles

| Role                 | Access Level                 | Permissions                                           |
| -------------------- | ---------------------------- | ----------------------------------------------------- |
| **Super Admin**      | Full system access           | All permissions                                       |
| **Exam Coordinator** | Results & student management | Manage results, view students, upload results         |
| **Faculty**          | View-only access             | View students, view results, update profile           |
| **Student**          | Personal data access         | View own results, update profile, apply for admission |

## 🛡️ Protection Layers

### 1. Middleware Protection (Server-Side)

Automatically protects routes before they load:

```typescript
// Configured in src/middleware.ts
/admin/* → Super Admin, Exam Coordinator only
/faculty/* → Faculty only
/student/* → Student only
```

### 2. Component Protection (Client-Side)

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

<ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
  <AdminDashboard />
</ProtectedRoute>;
```

### 3. Permission Gates (UI-Level)

```tsx
import { PermissionGate } from "@/components/auth/PermissionGate";

<PermissionGate permission="manage:results">
  <UploadButton />
</PermissionGate>;
```

### 4. API Protection (Endpoint-Level)

```typescript
import { protectApiRoute } from "@/lib/api-protection";

export async function POST() {
  const auth = await protectApiRoute([UserRole.SUPER_ADMIN]);
  if (auth instanceof NextResponse) return auth;

  // Protected logic here
}
```

## 📖 Usage Examples

### Check User Role

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { isSuperAdmin, isStudent, userRole } = useAuth();

  if (isSuperAdmin) {
    return <AdminView />;
  }

  return <DefaultView />;
}
```

### Check Permission

```tsx
const { checkPermission } = useAuth();

if (checkPermission("upload:results")) {
  // Show upload button
}
```

### Protect API Route

```typescript
// src/app/api/protected/route.ts
import { protectApiRoute } from "@/lib/api-protection";
import { UserRole } from "@/lib/rbac";

export async function GET() {
  const auth = await protectApiRoute([UserRole.SUPER_ADMIN], "manage:settings");
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({ data: "Protected" });
}
```

## 🎨 Custom Branding

The sign-in/sign-up pages are fully customized with SKCET branding:

- Primary color: `#003366` (Navy Blue)
- Accent color: `#FF8C00` (Orange)
- Custom gradient backgrounds
- Rounded corners and modern UI
- Responsive design

## 📚 Documentation

- **[Clerk Setup Guide](./docs/CLERK_SETUP.md)** - Step-by-step Clerk configuration
- **[Auth & RBAC Guide](./docs/AUTH_RBAC_GUIDE.md)** - Complete system documentation
- **[API Reference](./docs/AUTH_RBAC_GUIDE.md#api-security)** - API protection patterns

## 🔧 Configuration

### Adding a New Role

1. Add to `UserRole` enum in `src/lib/rbac.ts`
2. Define permissions in `RolePermissions`
3. Add route access rules
4. Update onboarding page

### Adding a New Permission

1. Add to relevant role's permissions array
2. Use in components with `checkPermission()`
3. Enforce in API routes with `protectApiRoute()`

## 🧪 Testing

### Test Users (Development)

Create test accounts for each role:

- `admin@test.com` → Super Admin
- `coordinator@test.com` → Exam Coordinator
- `faculty@test.com` → Faculty
- `student@test.com` → Student

### Manual Role Assignment

In Clerk Dashboard → Users → Select User → Metadata:

```json
{
  "role": "super_admin"
}
```

## 🚨 Security Best Practices

✅ **Always validate on the server** - Never trust client-side checks alone  
✅ **Use middleware for routes** - Prevents unauthorized page loads  
✅ **Protect all API endpoints** - Use `protectApiRoute` helper  
✅ **Store roles in Clerk metadata** - Centralized and secure  
✅ **Log security events** - Track unauthorized access attempts  
✅ **Use HTTPS in production** - Encrypt all data in transit

## 🐛 Troubleshooting

| Issue                    | Solution                                |
| ------------------------ | --------------------------------------- |
| User stuck on onboarding | Assign role manually in Clerk Dashboard |
| 403 on protected routes  | Check user role matches allowed roles   |
| API returns 401          | Ensure user is signed in                |
| Session not persisting   | Clear cookies and re-login              |

## 📦 Dependencies

- `@clerk/nextjs` - Authentication provider
- `next` - Framework
- `react` - UI library

## 🔄 Migration from Previous Auth

If migrating from a previous auth system:

1. Export user data with roles
2. Import users to Clerk
3. Set roles in public metadata
4. Update route protection
5. Test all flows

## 📞 Support

- **Clerk Issues**: [Clerk Documentation](https://clerk.com/docs)
- **RBAC Questions**: See `docs/AUTH_RBAC_GUIDE.md`
- **Bug Reports**: Create an issue in the repository

---

**Built with ❤️ for SKCET**

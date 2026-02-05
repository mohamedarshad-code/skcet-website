# Clerk Authentication Setup Guide

## Quick Start

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

1. In Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### 4. Enable Social Login (Optional)

1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Enable **Google** (or other providers)
3. Follow the setup wizard

### 5. Configure Redirect URLs

In Clerk Dashboard:

1. Go to **Paths**
2. Set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/onboarding`
   - After sign-up: `/onboarding`

### 6. Test Authentication

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-up`
3. Create a test account
4. You should be redirected to the onboarding page

## Setting Up User Roles

### Method 1: Through Onboarding (Recommended)

Users select their role during the onboarding flow after sign-up.

### Method 2: Manual Assignment (For Testing)

1. Go to Clerk Dashboard → **Users**
2. Select a user
3. Click **Metadata** tab
4. Add to **Public Metadata**:
   ```json
   {
     "role": "super_admin"
   }
   ```
5. Click **Save**

### Available Roles

- `super_admin` - Full system access
- `exam_coordinator` - Results and student management
- `faculty` - View students and results
- `student` - View own results and profile

## Testing the RBAC System

### 1. Create Test Users

Create one user for each role:

- admin@skcet.ac.in (super_admin)
- coordinator@skcet.ac.in (exam_coordinator)
- faculty@skcet.ac.in (faculty)
- student@skcet.ac.in (student)

### 2. Test Route Access

Try accessing these routes with different roles:

- `/admin/dashboard` - Super Admin only
- `/admin/results` - Super Admin, Exam Coordinator
- `/faculty/dashboard` - Faculty only
- `/student/dashboard` - Student only

### 3. Test API Protection

Use tools like Postman or curl:

```bash
# This should return 401 (Unauthorized)
curl http://localhost:3000/api/admin/users

# Sign in first, then try with session cookie
```

## Customization

### Custom Branding

The sign-in/sign-up pages are already customized with SKCET branding. To modify:

1. Edit `src/app/sign-in/[[...sign-in]]/page.tsx`
2. Update the `appearance` prop in the `<SignIn>` component

### Adding New Roles

1. Add role to `UserRole` enum in `src/lib/rbac.ts`
2. Define permissions in `RolePermissions`
3. Add route access in `RouteAccess`
4. Update middleware if needed
5. Add to onboarding page

### Adding New Permissions

1. Add permission to relevant role in `RolePermissions`
2. Use `checkPermission()` or `PermissionGate` to enforce

## Troubleshooting

### "Invalid publishable key"

- Make sure you copied the correct key from Clerk Dashboard
- Ensure it starts with `pk_test_` or `pk_live_`
- Check for extra spaces or quotes

### "User redirected to onboarding after login"

- User doesn't have a role assigned
- Assign role manually or complete onboarding flow

### "403 Forbidden on protected routes"

- Check user's role in Clerk Dashboard
- Verify role matches allowed roles for that route
- Check middleware configuration

### Session not persisting

- Clear browser cookies
- Check Clerk session settings
- Verify environment variables are loaded

## Production Deployment

### 1. Switch to Production Keys

1. In Clerk Dashboard, go to **Production** instance
2. Get production API keys
3. Update environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

### 2. Configure Production URLs

Update redirect URLs to your production domain:

```env
NEXT_PUBLIC_APP_URL=https://skcet.ac.in
```

### 3. Enable Production Features

- Enable email verification
- Configure password policies
- Set up rate limiting
- Enable audit logs

## Support

For issues with:

- **Clerk Setup**: [Clerk Documentation](https://clerk.com/docs)
- **RBAC System**: See `docs/AUTH_RBAC_GUIDE.md`
- **General Issues**: Check the troubleshooting section above

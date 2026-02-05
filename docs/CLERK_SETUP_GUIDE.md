# 🔐 Clerk + Supabase Integration Guide

## Overview

This guide will help you integrate Clerk authentication with your Supabase database for the SKCET portal.

---

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ All 4 migrations successfully run
- ✅ Clerk account created
- ⏳ Clerk application configured

---

## Step 1: Configure Clerk JWT Template

### 1.1 Go to Clerk Dashboard

1. Navigate to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your **SKCET** application
3. Go to **JWT Templates** (in the left sidebar under "Configure")

### 1.2 Create Supabase JWT Template

1. Click **"New template"**
2. Select **"Supabase"** from the template list
3. Name it: `supabase`

### 1.3 Configure the Template

Replace the default template with this custom configuration:

```json
{
  "aud": "authenticated",
  "exp": {{exp}},
  "iat": {{iat}},
  "iss": "{{iss}}",
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "phone": "{{user.primary_phone_number}}",
  "app_metadata": {
    "provider": "clerk"
  },
  "user_metadata": {
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "full_name": "{{user.full_name}}"
  },
  "role": "{{user.public_metadata.role}}",
  "email_verified": {{user.email_verified}},
  "phone_verified": {{user.phone_verified}}
}
```

**Important Fields:**

- `sub`: Clerk user ID (stored as `clerk_id` in your database)
- `role`: User role from Clerk metadata (student, faculty, exam_coordinator, super_admin)
- `email`: User's email address

### 1.4 Save the Template

Click **"Save"** and note the template name: `supabase`

---

## Step 2: Set Up Clerk Webhook for User Sync

### 2.1 Create Webhook Endpoint

You need to create an API route to sync Clerk users to Supabase.

**File**: `app/api/webhooks/clerk/route.ts`

```typescript
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin access
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    // Insert user into Supabase
    const { error } = await supabase.from("users").insert({
      clerk_id: id,
      email: email_addresses[0]?.email_address,
      first_name: first_name || "",
      last_name: last_name || "",
      role: (public_metadata as any)?.role || "student", // Default to student
    });

    if (error) {
      console.error("Error creating user in Supabase:", error);
      return new Response("Error: Failed to create user", { status: 500 });
    }

    console.log("✅ User created in Supabase:", id);
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    // Update user in Supabase
    const { error } = await supabase
      .from("users")
      .update({
        email: email_addresses[0]?.email_address,
        first_name: first_name || "",
        last_name: last_name || "",
        role: (public_metadata as any)?.role || "student",
      })
      .eq("clerk_id", id);

    if (error) {
      console.error("Error updating user in Supabase:", error);
      return new Response("Error: Failed to update user", { status: 500 });
    }

    console.log("✅ User updated in Supabase:", id);
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    // Soft delete or hard delete user
    const { error } = await supabase.from("users").delete().eq("clerk_id", id);

    if (error) {
      console.error("Error deleting user in Supabase:", error);
      return new Response("Error: Failed to delete user", { status: 500 });
    }

    console.log("✅ User deleted from Supabase:", id);
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
```

### 2.2 Configure Webhook in Clerk Dashboard

1. Go to **Webhooks** in Clerk Dashboard
2. Click **"Add Endpoint"**
3. Enter your webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://skcet.ac.in/api/webhooks/clerk`
4. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Click **"Create"**
6. Copy the **Signing Secret** and add to `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Step 3: Update Environment Variables

Add these to your `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Configure Supabase to Accept Clerk JWTs

### 4.1 Get Clerk JWKS URL

Your Clerk JWKS URL is:

```
https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
```

### 4.2 Update Supabase JWT Settings

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"JWT Settings"**
3. Add Clerk as an additional JWT issuer:
   - **JWKS URL**: `https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json`
   - **Audience**: `authenticated`

**Note**: This allows Supabase to verify JWTs issued by Clerk.

---

## Step 5: Create Supabase Client with Clerk Token

### 5.1 Server-Side Client (for API routes)

**File**: `lib/supabase/server.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createSupabaseServerClient() {
  const { getToken } = auth();
  const supabaseAccessToken = await getToken({ template: "supabase" });

  if (!supabaseAccessToken) {
    throw new Error("No Supabase token available");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    },
  );
}
```

### 5.2 Client-Side Client (for React components)

**File**: `lib/supabase/client.ts`

```typescript
"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function useSupabaseClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await getToken({ template: "supabase" });

            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      },
    );
  }, [getToken]);
}
```

---

## Step 6: Test the Integration

### 6.1 Create a Test User

1. Go to your app's sign-up page
2. Create a new user with email: `test@skcet.ac.in`
3. Check Supabase **Table Editor** → `users` table
4. Verify the user was created with the correct `clerk_id`

### 6.2 Test RLS Policies

Create a simple API route to test:

**File**: `app/api/test-rls/route.ts`

```typescript
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  // This should only return the current user's profile
  const { data, error } = await supabase.from("users").select("*").single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ user: data });
}
```

Visit `/api/test-rls` while logged in - you should see your user data!

---

## 🎯 **Quick Checklist**

- [ ] JWT Template created in Clerk (`supabase`)
- [ ] Webhook endpoint created (`/api/webhooks/clerk`)
- [ ] Webhook configured in Clerk Dashboard
- [ ] Environment variables updated
- [ ] Supabase JWT settings configured
- [ ] Supabase client utilities created
- [ ] Test user created successfully
- [ ] RLS policies tested and working

---

## 🐛 **Troubleshooting**

### Issue: "No Supabase token available"

**Solution**: Make sure you're calling `getToken({ template: 'supabase' })` with the correct template name.

### Issue: "JWT verification failed"

**Solution**: Check that your Clerk JWKS URL is correctly configured in Supabase JWT settings.

### Issue: "User not created in Supabase"

**Solution**: Check webhook logs in Clerk Dashboard and your API route logs.

### Issue: "RLS policy denies access"

**Solution**: Verify that the `role` field in the JWT matches the user's role in the database.

---

## 📚 **Next Steps After Integration**

1. ✅ Build user profile pages
2. ✅ Create student/faculty dashboards
3. ✅ Implement exam results viewing
4. ✅ Build placement application system
5. ✅ Create announcement management

---

**Need help?** Check the [Clerk Docs](https://clerk.com/docs) or [Supabase Docs](https://supabase.com/docs)

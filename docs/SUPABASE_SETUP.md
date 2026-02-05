# 🔗 Supabase Integration Guide

## Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Get API keys
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up Clerk + Supabase sync
- [ ] Test RLS policies
- [ ] Deploy Edge Functions (optional)

---

## 1️⃣ Create Supabase Project

### Step 1: Sign Up

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub

### Step 2: Create New Project

1. Click "New Project"
2. **Organization**: Select or create
3. **Name**: `skcet-portal`
4. **Database Password**: Generate strong password (save it!)
5. **Region**: Choose closest to India (e.g., `ap-south-1` - Mumbai)
6. Click "Create new project"

⏱️ **Wait 2-3 minutes** for project to be ready

---

## 2️⃣ Get API Keys

### From Supabase Dashboard

1. Go to **Settings** → **API**
2. Copy these values:

```env
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Anon/Public Key (safe for client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (NEVER expose to client!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3️⃣ Configure Environment Variables

### Update `.env.local`

```bash
# Existing Clerk variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Add Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL (for migrations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 4️⃣ Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 5️⃣ Create Supabase Client

### `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### `src/lib/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}
```

### `src/lib/supabase/admin.ts` (Service Role - Server Only!)

```typescript
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
```

---

## 6️⃣ Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option B: Manual SQL Execution

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy content from each migration file:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_audit_triggers.sql`
   - `004_seed_data.sql`
3. Run each one in order
4. Click "Run"

---

## 7️⃣ Sync Clerk Users with Supabase

### Create Webhook in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. **Webhooks** → **Add Endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
4. **Events**: Select:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy **Signing Secret**

### Add to `.env.local`

```bash
CLERK_WEBHOOK_SECRET=whsec_...
```

### Create Webhook Handler

**`src/app/api/webhooks/clerk/route.ts`**

```typescript
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // Get headers
  const headerPayload = await headers();
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

  // Handle events
  const supabase = createAdminClient();

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    await supabase.from("users").insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      first_name,
      last_name,
      role: unsafe_metadata?.role || "student",
    });
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    await supabase
      .from("users")
      .update({
        email: email_addresses[0].email_address,
        first_name,
        last_name,
        role: unsafe_metadata?.role,
      })
      .eq("clerk_id", id);
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    await supabase.from("users").delete().eq("clerk_id", id);
  }

  return new Response("Webhook processed", { status: 200 });
}
```

---

## 8️⃣ Configure JWT Template in Clerk

### Why?

RLS policies use JWT claims to determine user permissions.

### Steps:

1. Go to **Clerk Dashboard** → **JWT Templates**
2. Click **New Template** → **Supabase**
3. **Name**: `supabase`
4. **Claims**:

```json
{
  "role": "{{user.unsafe_metadata.role}}",
  "email": "{{user.primary_email_address}}"
}
```

5. Click **Save**
6. Go to **API Keys** → **Advanced** → **JWT Template**
7. Select `supabase` template

---

## 9️⃣ Update Middleware for Supabase

### `src/middleware.ts`

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Set Supabase auth cookie with Clerk JWT
  if (userId && sessionClaims) {
    const response = NextResponse.next();

    // Pass Clerk JWT to Supabase
    response.cookies.set("sb-access-token", sessionClaims.sub as string, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

## 🔟 Test RLS Policies

### Create Test User

1. Sign up at `/sign-up` with `test@skcet.ac.in`
2. Select "Student" role
3. Check Supabase Dashboard → **Table Editor** → `users`
4. Verify user was created

### Test Student Can't See Other Results

```typescript
// This should return ONLY the logged-in student's results
const { data, error } = await supabase
  .from("results")
  .select("*")
  .eq("is_published", true);

console.log(data); // Should only show current student's results
```

### Test Admin Can See All

```typescript
// Login as exam_coordinator or super_admin
const { data, error } = await supabase.from("results").select("*");

console.log(data); // Should show ALL results
```

---

## 📊 Verify Setup

### Checklist

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Supabase clients created
- [ ] Migrations run successfully
- [ ] Clerk webhook configured
- [ ] JWT template set up
- [ ] Test user created
- [ ] RLS policies working

### Test Queries

```typescript
// Test connection
const { data, error } = await supabase.from("departments").select("*");
console.log("Departments:", data);

// Test RLS
const { data: results } = await supabase.from("results").select("*");
console.log("Results (should be filtered by RLS):", results);
```

---

## 🚨 Common Issues

### Issue 1: "relation does not exist"

**Solution**: Run migrations in correct order

### Issue 2: RLS blocking all queries

**Solution**: Check JWT template in Clerk, ensure `role` claim is set

### Issue 3: Webhook not working

**Solution**:

- Verify webhook secret
- Check endpoint URL is accessible
- Test with ngrok for local development

### Issue 4: "Invalid JWT"

**Solution**: Regenerate Clerk API keys and update `.env.local`

---

## 🎯 Next Steps

1. ✅ Create API routes for data fetching
2. ✅ Build UI components for results, announcements
3. ✅ Implement file upload for documents
4. ✅ Set up real-time subscriptions (optional)
5. ✅ Deploy to production

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Clerk + Supabase](https://clerk.com/docs/integrations/databases/supabase)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Ready to integrate!** 🚀

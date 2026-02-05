# 📋 Supabase Integration Checklist

Use this checklist to track your Supabase setup progress.

---

## ✅ Phase 1: Supabase Project Setup

- [ ] **Create Supabase Account**
  - Go to [supabase.com](https://supabase.com)
  - Sign up with GitHub

- [ ] **Create New Project**
  - Project name: `skcet-portal`
  - Region: `ap-south-1` (Mumbai)
  - Database password: ********\_******** (save this!)
  - Wait 2-3 minutes for setup

- [ ] **Get API Keys**
  - Go to Settings → API
  - Copy Project URL: ********\_********
  - Copy Anon Key: ********\_********
  - Copy Service Role Key: ********\_******** (keep secret!)

---

## ✅ Phase 2: Environment Configuration

- [ ] **Update `.env.local`**

  ```bash
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  ```

- [ ] **Install Dependencies**

  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```

- [ ] **Restart Dev Server**
  ```bash
  # Stop current server (Ctrl+C)
  npm run dev
  ```

---

## ✅ Phase 3: Database Migrations

### Option A: Supabase CLI (Recommended)

- [ ] **Install Supabase CLI**

  ```bash
  npm install -g supabase
  ```

- [ ] **Login to Supabase**

  ```bash
  supabase login
  ```

- [ ] **Link Project**

  ```bash
  supabase link --project-ref your-project-ref
  ```

  - Get project ref from: Settings → General → Reference ID

- [ ] **Push Migrations**

  ```bash
  supabase db push
  ```

- [ ] **Verify Success**
  - Check for "All migrations applied successfully"
  - No errors in output

### Option B: Manual SQL Execution

- [ ] **Run Migration 001**
  - Go to Supabase Dashboard → SQL Editor
  - Copy `supabase/migrations/001_initial_schema.sql`
  - Paste and run
  - Verify: "Success. No rows returned"

- [ ] **Run Migration 002**
  - Copy `supabase/migrations/002_rls_policies.sql`
  - Paste and run
  - Verify success

- [ ] **Run Migration 003**
  - Copy `supabase/migrations/003_audit_triggers.sql`
  - Paste and run
  - Verify success

- [ ] **Run Migration 004 (Optional)**
  - Copy `supabase/migrations/004_seed_data.sql`
  - Paste and run
  - Adds sample data for testing

---

## ✅ Phase 4: Verify Database

- [ ] **Check Tables Created**
  - Go to Table Editor
  - Should see 18 tables:
    - users
    - student_profiles
    - faculty_profiles
    - departments
    - programs
    - subjects
    - exam_sessions
    - results
    - hall_tickets
    - exam_timetables
    - announcements
    - events
    - event_registrations
    - documents
    - companies
    - placement_drives
    - placement_applications
    - audit_logs

- [ ] **Verify RLS Enabled**
  - Go to Authentication → Policies
  - Should see policies for each table

- [ ] **Check Seed Data (if ran 004)**
  - departments: 8 rows
  - companies: 8 rows
  - announcements: 4 rows
  - events: 3 rows

---

## ✅ Phase 5: Clerk Integration

- [ ] **Create Clerk Webhook**
  - Go to [Clerk Dashboard](https://dashboard.clerk.com)
  - Webhooks → Add Endpoint
  - URL: `https://your-domain.com/api/webhooks/clerk`
  - Events: `user.created`, `user.updated`, `user.deleted`
  - Copy signing secret: ********\_********

- [ ] **Add Webhook Secret to `.env.local`**

  ```bash
  CLERK_WEBHOOK_SECRET=whsec_...
  ```

- [ ] **Create Webhook Handler**
  - Create `src/app/api/webhooks/clerk/route.ts`
  - See `docs/SUPABASE_SETUP.md` for code

- [ ] **Configure JWT Template**
  - Clerk Dashboard → JWT Templates
  - New Template → Supabase
  - Add claims:
    ```json
    {
      "role": "{{user.unsafe_metadata.role}}",
      "email": "{{user.primary_email_address}}"
    }
    ```
  - Save and apply to API

---

## ✅ Phase 6: Create Supabase Clients

- [ ] **Create Client-Side Client**
  - File: `src/lib/supabase/client.ts`
  - See `docs/SUPABASE_SETUP.md` for code

- [ ] **Create Server-Side Client**
  - File: `src/lib/supabase/server.ts`
  - See `docs/SUPABASE_SETUP.md` for code

- [ ] **Create Admin Client**
  - File: `src/lib/supabase/admin.ts`
  - See `docs/SUPABASE_SETUP.md` for code

---

## ✅ Phase 7: Testing

- [ ] **Test User Creation**
  - Sign up with test email: `test@skcet.ac.in`
  - Password: `Test123!`
  - Select role: "Student"

- [ ] **Verify User in Supabase**
  - Go to Table Editor → users
  - Should see new user with clerk_id

- [ ] **Test RLS Policies**
  - Create test query in SQL Editor:
    ```sql
    SELECT * FROM results;
    ```
  - Should return empty (no results yet)

- [ ] **Test Announcements**
  - Query:
    ```sql
    SELECT * FROM announcements WHERE is_published = true;
    ```
  - Should return 4 announcements (if seed data loaded)

- [ ] **Test Departments**
  - Query:
    ```sql
    SELECT * FROM departments;
    ```
  - Should return 8 departments

---

## ✅ Phase 8: Build API Routes

- [ ] **Create Results API**
  - File: `src/app/api/results/route.ts`
  - Implement GET for student results

- [ ] **Create Announcements API**
  - File: `src/app/api/announcements/route.ts`
  - Implement GET for published announcements

- [ ] **Create Events API**
  - File: `src/app/api/events/route.ts`
  - Implement GET for upcoming events

- [ ] **Create Placements API**
  - File: `src/app/api/placements/route.ts`
  - Implement GET for active drives

---

## ✅ Phase 9: Build UI Components

- [ ] **Results Page**
  - Student dashboard → View results
  - Fetch from `/api/results`
  - Display in table

- [ ] **Announcements Feed**
  - Homepage → Latest announcements
  - Fetch from `/api/announcements`
  - Display as cards

- [ ] **Events Calendar**
  - Events page → Upcoming events
  - Fetch from `/api/events`
  - Display with registration

- [ ] **Placements Portal**
  - Placements page → Active drives
  - Fetch from `/api/placements`
  - Apply functionality

---

## ✅ Phase 10: Production Deployment

- [ ] **Enable Database Backups**
  - Supabase Dashboard → Database → Backups
  - Enable daily backups

- [ ] **Set Up Monitoring**
  - Enable query performance insights
  - Set up alerts for slow queries

- [ ] **Configure Rate Limiting**
  - Protect API endpoints
  - Use Supabase Edge Functions if needed

- [ ] **Enable Point-in-Time Recovery**
  - For production database
  - Allows restore to any point in time

- [ ] **Update Production Environment Variables**
  - Add Supabase keys to Vercel/hosting
  - Update webhook URL to production domain

---

## 📊 Progress Tracker

| Phase                  | Status | Date Completed |
| ---------------------- | ------ | -------------- |
| 1. Supabase Project    | ⬜     | ****\_\_****   |
| 2. Environment Config  | ⬜     | ****\_\_****   |
| 3. Database Migrations | ⬜     | ****\_\_****   |
| 4. Verify Database     | ⬜     | ****\_\_****   |
| 5. Clerk Integration   | ⬜     | ****\_\_****   |
| 6. Supabase Clients    | ⬜     | ****\_\_****   |
| 7. Testing             | ⬜     | ****\_\_****   |
| 8. API Routes          | ⬜     | ****\_\_****   |
| 9. UI Components       | ⬜     | ****\_\_****   |
| 10. Production Deploy  | ⬜     | ****\_\_****   |

---

## 🆘 Troubleshooting

### Common Issues

**❌ "relation does not exist"**

- ✅ Run migrations in order (001 → 002 → 003 → 004)

**❌ "RLS blocking all queries"**

- ✅ Check JWT template in Clerk
- ✅ Verify `role` claim is set

**❌ "Webhook not receiving events"**

- ✅ Check webhook URL is accessible
- ✅ Verify signing secret is correct
- ✅ Use ngrok for local testing

**❌ "Invalid JWT"**

- ✅ Regenerate Clerk API keys
- ✅ Update `.env.local`
- ✅ Restart dev server

---

## 📚 Resources

- [DATABASE_ARCHITECTURE.md](./docs/DATABASE_ARCHITECTURE.md)
- [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)
- [SCHEMA_DIAGRAM.md](./docs/SCHEMA_DIAGRAM.md)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk + Supabase](https://clerk.com/docs/integrations/databases/supabase)

---

**Start Date**: ****\_\_****  
**Target Completion**: ****\_\_****  
**Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete

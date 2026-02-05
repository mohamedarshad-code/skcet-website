# 🗄️ SKCET Supabase Database Architecture

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Row-Level Security](#row-level-security)
4. [Indexes & Optimization](#indexes--optimization)
5. [Setup Instructions](#setup-instructions)
6. [Common Queries](#common-queries)

---

## 🎯 Overview

This database architecture is designed for **Sri Krishna College of Engineering and Technology (SKCET)** portal with:

- ✅ **Student Privacy** - RLS ensures students can only view their own results
- ✅ **Role-Based Access** - Different permissions for students, faculty, exam coordinators, and admins
- ✅ **Audit Compliance** - Complete audit trail for all critical operations
- ✅ **Performance Optimized** - Strategic indexes for common queries
- ✅ **Scalable Design** - Supports thousands of students and faculty

---

## 📊 Database Schema

### Core Tables

#### 1. **Users & Profiles**

```sql
users                 -- Core user table (synced with Clerk)
├── student_profiles  -- Student-specific data
└── faculty_profiles  -- Faculty-specific data
```

**Key Fields:**

- `clerk_id` - Links to Clerk authentication
- `role` - student | faculty | exam_coordinator | super_admin
- `email` - Unique email address

#### 2. **Academic Structure**

```sql
departments          -- CSE, ECE, EEE, etc.
├── programs         -- B.E, M.E, B.Tech programs
└── subjects         -- Individual subjects/courses
```

#### 3. **Examinations**

```sql
exam_sessions        -- Semester exams, internals, etc.
├── results          -- Student exam results (RLS protected)
├── hall_tickets     -- Exam hall tickets
└── exam_timetables  -- Exam schedules
```

**Critical RLS on Results:**

- Students can ONLY view their own published results
- Exam coordinators can publish results
- Admins can view all results

#### 4. **Content Management**

```sql
announcements        -- Campus announcements
events              -- Workshops, seminars, fests
├── event_registrations
documents           -- Syllabus, notes, circulars
```

#### 5. **Placements**

```sql
companies           -- Recruiting companies
placement_drives    -- Placement opportunities
└── placement_applications  -- Student applications
```

#### 6. **Compliance**

```sql
audit_logs          -- Complete audit trail
└── audit_logs_archive  -- Historical logs
```

---

## 🔒 Row-Level Security (RLS)

### Key Policies

#### **Results Table** (Most Critical)

```sql
-- Students can ONLY view their own published results
CREATE POLICY "Students can view own published results"
  ON public.results FOR SELECT
  USING (
    is_published = true
    AND student_id IN (
      SELECT id FROM student_profiles WHERE user_id = auth.user_id()
    )
  );

-- Exam coordinators can publish results
CREATE POLICY "Exam coordinators can publish results"
  ON public.results FOR UPDATE
  USING (auth.is_exam_coordinator());
```

#### **Announcements**

```sql
-- All can view published, non-expired announcements
CREATE POLICY "All can view published announcements"
  ON public.announcements FOR SELECT
  USING (
    is_published = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );
```

#### **Placement Applications**

```sql
-- Students can only view their own applications
CREATE POLICY "Students can view own applications"
  ON public.placement_applications FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id = auth.user_id()
    )
  );
```

### Helper Functions

```sql
auth.user_role()        -- Get current user's role
auth.clerk_id()         -- Get Clerk user ID
auth.user_id()          -- Get database user ID
auth.is_admin()         -- Check if super_admin or exam_coordinator
auth.is_student()       -- Check if student
```

---

## ⚡ Indexes & Optimization

### Strategic Indexes

#### **1. Results Lookup (Most Frequent)**

```sql
-- Composite index for student result queries
CREATE INDEX idx_results_composite
  ON results(student_id, exam_session_id, is_published);

-- Includes marks and grade for covering index
CREATE INDEX idx_results_student_session_published
  ON results(student_id, exam_session_id, is_published)
  INCLUDE (marks_obtained, grade, status);
```

**Why?** Students frequently check: "Show me my results for semester X"

#### **2. Announcements Feed (Homepage)**

```sql
-- Optimized for homepage announcement feed
CREATE INDEX idx_announcements_homepage
  ON announcements(is_published, expires_at, published_at DESC)
  WHERE is_published = true AND (expires_at IS NULL OR expires_at > NOW());
```

**Why?** Homepage loads latest announcements on every visit

#### **3. Placements by Batch Year**

```sql
-- Quick lookup for current batch placements
CREATE INDEX idx_placement_drives_current
  ON placement_drives(batch_year, is_active, drive_date DESC)
  WHERE is_active = true;
```

**Why?** Students filter placements by their batch year

### Full-Text Search

```sql
-- Search announcements, events, documents
CREATE INDEX idx_announcements_search ON announcements USING GIN(search_vector);
CREATE INDEX idx_events_search ON events USING GIN(search_vector);
CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);
```

**Usage:**

```sql
SELECT * FROM announcements
WHERE search_vector @@ to_tsquery('english', 'exam & schedule');
```

### Materialized View

```sql
-- Pre-computed student results summary
CREATE MATERIALIZED VIEW student_results_summary AS
SELECT
  student_id,
  register_number,
  email,
  AVG(marks_obtained) AS average_marks,
  COUNT(*) AS total_exams
FROM student_profiles sp
JOIN results r ON r.student_id = sp.id
GROUP BY student_id, register_number, email;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY student_results_summary;
```

---

## 🚀 Setup Instructions

### 1. **Install Supabase CLI**

```bash
npm install -g supabase
```

### 2. **Initialize Supabase**

```bash
cd skcet-website
supabase init
```

### 3. **Link to Your Project**

```bash
supabase link --project-ref your-project-ref
```

### 4. **Run Migrations**

```bash
# Run all migrations in order
supabase db push

# Or run individually
supabase db execute --file supabase/migrations/001_initial_schema.sql
supabase db execute --file supabase/migrations/002_rls_policies.sql
supabase db execute --file supabase/migrations/003_audit_triggers.sql
supabase db execute --file supabase/migrations/004_seed_data.sql
```

### 5. **Verify Setup**

```bash
# Check tables
supabase db list

# Test RLS policies
supabase db test
```

---

## 📝 Common Queries

### Get Student Results

```sql
-- Using utility function
SELECT * FROM get_student_results('2021CSE001');

-- Manual query
SELECT
  s.code AS subject_code,
  s.name AS subject_name,
  r.marks_obtained,
  r.grade,
  r.status
FROM results r
JOIN subjects s ON r.subject_id = s.id
JOIN student_profiles sp ON r.student_id = sp.id
WHERE sp.register_number = '2021CSE001'
  AND r.is_published = true
ORDER BY r.created_at DESC;
```

### Get Recent Announcements

```sql
-- Using utility function
SELECT * FROM get_recent_announcements('exam', 5);

-- Manual query
SELECT * FROM announcements
WHERE is_published = true
  AND (expires_at IS NULL OR expires_at > NOW())
  AND category = 'exam'
ORDER BY published_at DESC
LIMIT 5;
```

### Get Upcoming Events

```sql
-- Using utility function
SELECT * FROM get_upcoming_events(10);

-- Manual query
SELECT * FROM events
WHERE is_published = true
  AND start_datetime > NOW()
ORDER BY start_datetime ASC
LIMIT 10;
```

### Get Placement Drives for Batch

```sql
SELECT
  pd.*,
  c.name AS company_name,
  c.logo_url
FROM placement_drives pd
JOIN companies c ON pd.company_id = c.id
WHERE pd.batch_year = 2024
  AND pd.is_active = true
  AND pd.registration_deadline > NOW()
ORDER BY pd.drive_date ASC;
```

### Search Announcements

```sql
SELECT * FROM announcements
WHERE search_vector @@ to_tsquery('english', 'exam | result | schedule')
  AND is_published = true
ORDER BY published_at DESC;
```

---

## 🔐 Security Best Practices

### 1. **Always Use RLS**

- Never disable RLS on production tables
- Test policies thoroughly before deployment

### 2. **Audit Critical Operations**

- Results publishing
- User role changes
- Placement application status updates

### 3. **Use Service Role Sparingly**

- Only for admin operations
- Never expose service key to client

### 4. **Validate Input**

- Use CHECK constraints
- Validate on both client and server

---

## 📈 Performance Monitoring

### Check Slow Queries

```sql
SELECT * FROM slow_queries;
```

### Analyze Query Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM results
WHERE student_id = 'xxx'
  AND is_published = true;
```

### Monitor Index Usage

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🛠️ Maintenance

### Refresh Materialized Views

```bash
# Run daily via cron or Supabase Edge Function
SELECT refresh_student_results_summary();
```

### Archive Old Audit Logs

```bash
# Run monthly
SELECT archive_old_audit_logs();
```

### Vacuum and Analyze

```sql
VACUUM ANALYZE;
```

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)

---

## 🎓 Database Statistics

- **Total Tables**: 18
- **RLS Policies**: 45+
- **Indexes**: 30+
- **Utility Functions**: 8
- **Audit Triggers**: 5
- **Materialized Views**: 1

---

**Last Updated**: 2026-02-05  
**Version**: 1.0.0  
**Maintainer**: SKCET Development Team

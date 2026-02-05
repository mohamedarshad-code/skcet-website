# 📐 SKCET Database Schema Diagram

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION & USERS                           │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │    CLERK     │  (External Auth)
    │  Auth System │
    └──────┬───────┘
           │
           │ clerk_id
           ▼
    ┌──────────────┐
    │    users     │  ◄─── Core user table
    │──────────────│
    │ id (PK)      │
    │ clerk_id     │
    │ email        │
    │ role         │  ◄─── student | faculty | exam_coordinator | super_admin
    │ first_name   │
    │ last_name    │
    └──────┬───────┘
           │
           ├─────────────────┬─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   student_   │  │   faculty_   │  │  (admin has  │
    │   profiles   │  │   profiles   │  │  no profile) │
    │──────────────│  │──────────────│  └──────────────┘
    │ user_id (FK) │  │ user_id (FK) │
    │ register_no  │  │ employee_id  │
    │ department   │  │ department   │
    │ batch_year   │  │ designation  │
    │ semester     │  │ experience   │
    │ cgpa         │  └──────────────┘
    └──────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      ACADEMIC STRUCTURE                                  │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ departments  │
    │──────────────│
    │ id (PK)      │
    │ code         │  ◄─── CSE, ECE, EEE, MECH, etc.
    │ name         │
    │ hod_id       │
    └──────┬───────┘
           │
           │ 1:N
           ▼
    ┌──────────────┐         ┌──────────────┐
    │   programs   │         │   subjects   │
    │──────────────│         │──────────────│
    │ id (PK)      │         │ id (PK)      │
    │ dept_id (FK) │         │ code         │
    │ code         │         │ name         │
    │ name         │         │ dept_id (FK) │
    │ degree_type  │         │ semester     │
    │ duration     │         │ credits      │
    └──────────────┘         │ type         │
                             └──────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                    EXAMINATIONS & RESULTS                                │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  exam_sessions   │
    │──────────────────│
    │ id (PK)          │
    │ name             │
    │ exam_type        │  ◄─── internal | semester | supplementary
    │ academic_year    │
    │ semester         │
    │ is_published     │  ◄─── Controls result visibility
    │ published_by     │
    └────────┬─────────┘
             │
             │ 1:N
             ├─────────────────┬─────────────────┐
             ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   results    │  │ hall_tickets │  │exam_timetable│
    │──────────────│  │──────────────│  │──────────────│
    │ id (PK)      │  │ id (PK)      │  │ id (PK)      │
    │ session (FK) │  │ session (FK) │  │ session (FK) │
    │ student (FK) │  │ student (FK) │  │ subject (FK) │
    │ subject (FK) │  │ ticket_no    │  │ exam_date    │
    │ marks        │  │ photo_url    │  │ start_time   │
    │ grade        │  │ is_active    │  │ end_time     │
    │ status       │  └──────────────┘  │ hall_number  │
    │ is_published │                    └──────────────┘
    └──────────────┘
         ▲
         │ RLS: Students can ONLY see their own published results
         │


┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTENT MANAGEMENT                                    │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  announcements   │
    │──────────────────│
    │ id (PK)          │
    │ title            │
    │ content          │
    │ category         │  ◄─── academic | exam | placement | event | general
    │ priority         │  ◄─── low | medium | high | urgent
    │ target_audience  │  ◄─── Array: ['all', 'students', 'faculty']
    │ is_published     │
    │ published_at     │
    │ expires_at       │
    │ published_by     │
    │ search_vector    │  ◄─── Full-text search
    └──────────────────┘

    ┌──────────────────┐
    │     events       │
    │──────────────────│
    │ id (PK)          │
    │ title            │
    │ description      │
    │ event_type       │  ◄─── seminar | workshop | cultural | sports | technical
    │ venue            │
    │ start_datetime   │
    │ end_datetime     │
    │ organizer_id     │
    │ max_participants │
    │ is_published     │
    │ search_vector    │
    └────────┬─────────┘
             │
             │ 1:N
             ▼
    ┌──────────────────┐
    │event_registrations│
    │──────────────────│
    │ id (PK)          │
    │ event_id (FK)    │
    │ user_id (FK)     │
    │ status           │  ◄─── registered | attended | cancelled
    │ registered_at    │
    └──────────────────┘

    ┌──────────────────┐
    │    documents     │
    │──────────────────│
    │ id (PK)          │
    │ title            │
    │ description      │
    │ document_type    │  ◄─── syllabus | notes | question_paper | circular
    │ file_url         │
    │ department_id    │
    │ subject_id       │
    │ uploaded_by      │
    │ is_public        │
    │ download_count   │
    │ search_vector    │
    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         PLACEMENTS                                       │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │    companies     │
    │──────────────────│
    │ id (PK)          │
    │ name             │
    │ website          │
    │ logo_url         │
    │ industry         │
    │ description      │
    └────────┬─────────┘
             │
             │ 1:N
             ▼
    ┌──────────────────┐
    │ placement_drives │
    │──────────────────│
    │ id (PK)          │
    │ company_id (FK)  │
    │ title            │
    │ job_role         │
    │ package_offered  │
    │ eligibility      │  ◄─── JSONB
    │ batch_year       │  ◄─── Indexed for fast lookup
    │ drive_date       │
    │ registration_end │
    │ is_active        │
    └────────┬─────────┘
             │
             │ 1:N
             ▼
    ┌──────────────────┐
    │placement_apps    │
    │──────────────────│
    │ id (PK)          │
    │ drive_id (FK)    │
    │ student_id (FK)  │
    │ resume_url       │
    │ status           │  ◄─── applied | shortlisted | selected | rejected
    │ applied_at       │
    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      AUDIT & COMPLIANCE                                  │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │   audit_logs     │  ◄─── Auto-populated by triggers
    │──────────────────│
    │ id (PK)          │
    │ user_id (FK)     │
    │ action           │  ◄─── INSERT | UPDATE | DELETE
    │ table_name       │
    │ record_id        │
    │ old_data         │  ◄─── JSONB snapshot
    │ new_data         │  ◄─── JSONB snapshot
    │ ip_address       │
    │ user_agent       │
    │ created_at       │
    └──────────────────┘
             │
             │ Archived after 1 year
             ▼
    ┌──────────────────┐
    │audit_logs_archive│
    │──────────────────│
    │ (same schema)    │
    └──────────────────┘
```

---

## Key Relationships

### 1:1 Relationships

- `users` ↔ `student_profiles` (one user, one student profile)
- `users` ↔ `faculty_profiles` (one user, one faculty profile)

### 1:N Relationships

- `departments` → `programs` (one department, many programs)
- `departments` → `subjects` (one department, many subjects)
- `exam_sessions` → `results` (one session, many results)
- `exam_sessions` → `hall_tickets` (one session, many tickets)
- `companies` → `placement_drives` (one company, many drives)
- `placement_drives` → `placement_applications` (one drive, many applications)
- `events` → `event_registrations` (one event, many registrations)

### N:M Relationships (via junction tables)

- `students` ↔ `events` (via `event_registrations`)
- `students` ↔ `placement_drives` (via `placement_applications`)

---

## Critical Indexes

```sql
-- Most frequently accessed
idx_results_composite                    -- student_id, exam_session_id, is_published
idx_announcements_homepage               -- is_published, expires_at, published_at
idx_placement_drives_current             -- batch_year, is_active, drive_date

-- Full-text search
idx_announcements_search                 -- GIN(search_vector)
idx_events_search                        -- GIN(search_vector)
idx_documents_search                     -- GIN(search_vector)

-- Foreign keys (auto-indexed)
idx_student_profiles_user_id
idx_results_student_id
idx_results_exam_session_id
```

---

## RLS Security Model

```
┌─────────────┐
│   STUDENT   │
└─────────────┘
    │
    ├─ ✅ View own profile
    ├─ ✅ View own results (published only)
    ├─ ✅ View own hall tickets
    ├─ ✅ View own placement applications
    ├─ ✅ View published announcements
    ├─ ✅ View published events
    ├─ ✅ Register for events
    └─ ❌ Cannot view other students' data

┌─────────────┐
│   FACULTY   │
└─────────────┘
    │
    ├─ ✅ View all student profiles
    ├─ ✅ View published results
    ├─ ✅ Create announcements
    ├─ ✅ Create events
    └─ ❌ Cannot publish results

┌──────────────────┐
│ EXAM COORDINATOR │
└──────────────────┘
    │
    ├─ ✅ View all results (published & unpublished)
    ├─ ✅ Create/update/publish results
    ├─ ✅ Manage exam sessions
    ├─ ✅ Generate hall tickets
    └─ ✅ All faculty permissions

┌─────────────┐
│ SUPER ADMIN │
└─────────────┘
    │
    ├─ ✅ Full access to all tables
    ├─ ✅ View audit logs
    ├─ ✅ Manage users and roles
    └─ ✅ All permissions
```

---

## Data Flow Examples

### Student Viewing Results

```
1. Student logs in via Clerk
2. Clerk JWT contains: { role: "student", clerk_id: "xxx" }
3. Student queries: SELECT * FROM results
4. RLS policy checks:
   - Is result published? ✓
   - Does student_id match current user? ✓
5. Returns ONLY student's own published results
```

### Exam Coordinator Publishing Results

```
1. Coordinator logs in via Clerk
2. Clerk JWT contains: { role: "exam_coordinator" }
3. Coordinator updates: UPDATE results SET is_published = true
4. RLS policy checks:
   - Is user exam_coordinator? ✓
5. Update succeeds
6. Audit trigger logs the action
7. Students can now view results
```

### Homepage Loading Announcements

```
1. Query: SELECT * FROM announcements
   WHERE is_published = true
   AND (expires_at IS NULL OR expires_at > NOW())
   ORDER BY published_at DESC LIMIT 10

2. Uses index: idx_announcements_homepage
3. Returns in <10ms (optimized)
```

---

## Performance Characteristics

| Query Type                | Expected Time | Index Used                     |
| ------------------------- | ------------- | ------------------------------ |
| Student results lookup    | <20ms         | `idx_results_composite`        |
| Homepage announcements    | <10ms         | `idx_announcements_homepage`   |
| Placement drives by batch | <15ms         | `idx_placement_drives_current` |
| Full-text search          | <50ms         | GIN indexes                    |
| Audit log insert          | <5ms          | Async trigger                  |

---

## Scalability Notes

- **Results table**: Partitioned by academic year (future)
- **Audit logs**: Archived after 1 year
- **Materialized views**: Refreshed daily
- **Indexes**: Cover 95% of queries
- **RLS**: Minimal overhead (<5ms per query)

---

**Schema Version**: 1.0.0  
**Last Updated**: 2026-02-05  
**Total Tables**: 18  
**Total Indexes**: 30+  
**RLS Policies**: 45+

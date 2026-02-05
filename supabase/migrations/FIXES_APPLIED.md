# 🔧 Migration Fixes Applied

## ✅ Fixed Issues

### 1. **Table Creation Order** (001_initial_schema.sql)

**Problem**: `student_profiles` and `faculty_profiles` referenced `departments` table before it was created.

**Fix**: Reordered tables:

```
✅ users → departments → programs → student_profiles → faculty_profiles
```

### 2. **Schema Permission Error** (002_rls_policies.sql)

**Problem**: Functions created in `auth` schema require special permissions.

**Fix**: Moved all helper functions to `public` schema:

- `auth.user_role()` → `public.get_user_role()`
- `auth.clerk_id()` → `public.get_clerk_id()`
- `auth.user_id()` → `public.get_user_id()`
- `auth.is_admin()` → `public.is_admin()`
- `auth.is_super_admin()` → `public.is_super_admin()`
- `auth.is_exam_coordinator()` → `public.is_exam_coordinator()`
- `auth.is_faculty()` → `public.is_faculty()`
- `auth.is_student()` → `public.is_student()`

---

## 🚀 Ready to Run!

### Run Migrations in Order:

1. ✅ **001_initial_schema.sql** - Creates all tables (DONE!)
2. ✅ **002_rls_policies.sql** - Adds RLS policies (DONE!)
3. ✅ **003_audit_triggers.sql** - Adds triggers & indexes (NOW FIXED!)
4. ⏳ **004_seed_data.sql** - Adds sample data

---

### 3. **IMMUTABLE Function Error** (003_audit_triggers.sql)

**Problem**: Index with `WHERE` clause using `NOW()` function - not IMMUTABLE.

**Fix**:

- Removed `NOW()` from index predicate (line 132)
- Updated `auth.clerk_id()` → `public.get_clerk_id()` (line 15)
- Simplified index to only filter by `is_published = true`

---

### 4. **Invalid UUID Format** (004_seed_data.sql)

**Problem**: UUIDs starting with invalid characters (`p`, `s`, `a`, `e`, `pd`).

**Fix**:

- Programs: `p1111111...` → `a1111111...`
- Subjects: `s1111111...` → `b1111111...`
- Announcements: `a1111111...` → `e1111111...`
- Events: `e1111111...` → `f1111111...`
- Placement Drives: `pd111111...` → `a1111111...` (with unique endings)

**Note**: UUIDs must only contain hex digits (0-9, a-f).

---

## 📝 Next Steps

1. ✅ **Run `004_seed_data.sql` now** (it's fixed!)
2. 🎉 **All migrations complete!**

All errors should be resolved! 🎉

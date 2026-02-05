# Supabase Migrations

This directory contains all database migrations for the SKCET portal.

## 📁 Migration Files

| File                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| `001_initial_schema.sql` | Core tables, relationships, and constraints   |
| `002_rls_policies.sql`   | Row-Level Security policies for all tables    |
| `003_audit_triggers.sql` | Audit logging, indexes, and utility functions |
| `004_seed_data.sql`      | Sample data for development and testing       |

## 🚀 Running Migrations

### Option 1: Supabase CLI (Recommended)

```bash
# Install CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

### Option 2: Manual Execution

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from each migration file
3. Run in order: 001 → 002 → 003 → 004
4. Verify each completes successfully

## ⚠️ Important Notes

- **Run migrations in order** - They have dependencies
- **001 must run first** - Creates all tables
- **002 requires 001** - Adds RLS policies to tables
- **003 requires 001 & 002** - Adds triggers and functions
- **004 is optional** - Only for development/testing

## 🔄 Migration Status

Check migration status:

```bash
supabase db list
```

## 📚 Documentation

For detailed information, see:

- [DATABASE_ARCHITECTURE.md](../docs/DATABASE_ARCHITECTURE.md)
- [SUPABASE_SETUP.md](../docs/SUPABASE_SETUP.md)
- [SCHEMA_DIAGRAM.md](../docs/SCHEMA_DIAGRAM.md)

## 🧪 Testing

After running migrations:

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Test a query
SELECT * FROM departments;
```

## 🔐 Security

- All tables have RLS enabled
- Service role bypasses RLS (use carefully!)
- Anon key respects RLS (safe for client-side)

## 📊 What Gets Created

- **18 tables** - Complete data model
- **45+ RLS policies** - Secure access control
- **30+ indexes** - Performance optimization
- **15+ triggers** - Auto-updates and audit logging
- **8 utility functions** - Common queries
- **1 materialized view** - Pre-computed summaries

## 🆘 Troubleshooting

**Error: "relation already exists"**

- Tables already created, safe to ignore or drop and recreate

**Error: "permission denied"**

- Check you're using correct credentials
- Verify project ref is correct

**Error: "syntax error"**

- Ensure you're running migrations in order
- Check PostgreSQL version compatibility

## 🔄 Rollback

To rollback migrations:

```bash
# Using Supabase CLI
supabase db reset

# Manual
# Drop tables in reverse order
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS placement_applications CASCADE;
-- ... etc
```

## 📝 Creating New Migrations

```bash
# Generate new migration file
supabase migration new your_migration_name

# Edit the generated file
# Then push
supabase db push
```

---

**Last Updated**: 2026-02-05  
**Version**: 1.0.0

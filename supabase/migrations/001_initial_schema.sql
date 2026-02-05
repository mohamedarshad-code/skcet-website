-- SKCET Database Schema
-- Migration: 001_initial_schema
-- Description: Core tables for SKCET portal with RLS policies

-- Wrap in transaction for atomicity
BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS (no dependencies)
-- =====================================================

-- Users table (extends Clerk authentication)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'exam_coordinator', 'super_admin')),
    phone TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DEPARTMENTS AND PROGRAMS (referenced by profiles)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    hod_id UUID REFERENCES public.users(id),
    established_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    degree_type TEXT CHECK (degree_type IN ('UG', 'PG', 'PhD')),
    duration_years INTEGER,
    total_semesters INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STUDENT AND FACULTY PROFILES (now departments exists)
-- =====================================================

-- Student profiles (additional student-specific data)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    register_number TEXT UNIQUE NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    batch_year INTEGER NOT NULL,
    current_semester INTEGER CHECK (current_semester BETWEEN 1 AND 8),
    section TEXT,
    cgpa DECIMAL(3, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Faculty profiles
CREATE TABLE IF NOT EXISTS public.faculty_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    designation TEXT,
    specialization TEXT,
    qualification TEXT,
    experience_years INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- EXAM SESSIONS AND SUBJECTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.exam_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    exam_type TEXT CHECK (exam_type IN ('internal', 'semester', 'supplementary')),
    academic_year TEXT NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    start_date DATE,
    end_date DATE,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    credits INTEGER,
    subject_type TEXT CHECK (subject_type IN ('theory', 'practical', 'project')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESULTS (depends on exam_sessions, student_profiles, subjects)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_session_id UUID REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    marks_obtained INTEGER CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    grade TEXT,
    grade_points DECIMAL(3, 2),
    status TEXT CHECK (status IN ('pass', 'fail', 'absent', 'revaluation')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_session_id, student_id, subject_id)
);

-- =====================================================
-- HALL TICKETS AND TIMETABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.hall_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_session_id UUID REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_session_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.exam_timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_session_id UUID REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hall_number TEXT,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANNOUNCEMENTS AND EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('academic', 'exam', 'placement', 'event', 'general')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    target_audience TEXT[] DEFAULT ARRAY['all'], -- ['all', 'students', 'faculty', 'specific_department']
    department_id UUID REFERENCES public.departments(id),
    attachments JSONB DEFAULT '[]',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES public.users(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('seminar', 'workshop', 'cultural', 'sports', 'technical', 'placement')),
    venue TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    organizer_id UUID REFERENCES public.users(id),
    department_id UUID REFERENCES public.departments(id),
    registration_required BOOLEAN DEFAULT false,
    max_participants INTEGER,
    banner_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =====================================================
-- DOCUMENTS AND RESOURCES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT CHECK (document_type IN ('syllabus', 'notes', 'question_paper', 'circular', 'form', 'other')),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    department_id UUID REFERENCES public.departments(id),
    subject_id UUID REFERENCES public.subjects(id),
    uploaded_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLACEMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    industry TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    title TEXT NOT NULL,
    description TEXT,
    job_role TEXT,
    package_offered TEXT,
    eligibility_criteria JSONB,
    batch_year INTEGER,
    drive_date DATE,
    registration_deadline TIMESTAMPTZ,
    venue TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.placement_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    resume_url TEXT,
    status TEXT CHECK (status IN ('applied', 'shortlisted', 'selected', 'rejected')) DEFAULT 'applied',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, student_id)
);

-- =====================================================
-- AUDIT LOGS FOR COMPLIANCE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR OPTIMIZATION
-- =====================================================

-- Users and profiles
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_student_profiles_register_number ON public.student_profiles(register_number);
CREATE INDEX IF NOT EXISTS idx_student_profiles_department ON public.student_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_batch_year ON public.student_profiles(batch_year);

-- Results (frequent lookup by student email via join)
CREATE INDEX IF NOT EXISTS idx_results_student_id ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_session ON public.results(exam_session_id);
CREATE INDEX IF NOT EXISTS idx_results_published ON public.results(is_published);
CREATE INDEX IF NOT EXISTS idx_results_composite ON public.results(student_id, exam_session_id, is_published);

-- Announcements (homepage feed)
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON public.announcements(expires_at);

-- Placements by batch year
CREATE INDEX IF NOT EXISTS idx_placement_drives_batch_year ON public.placement_drives(batch_year);
CREATE INDEX IF NOT EXISTS idx_placement_drives_active ON public.placement_drives(is_active, drive_date DESC);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON public.events(start_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_profiles_updated_at BEFORE UPDATE ON public.faculty_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_sessions_updated_at BEFORE UPDATE ON public.exam_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commit transaction
COMMIT;

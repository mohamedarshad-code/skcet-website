-- SKCET Row-Level Security Policies
-- Migration: 002_rls_policies
-- Description: Comprehensive RLS policies for data privacy and access control

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Get current user's role from Clerk JWT
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role',
    NULL
  )::TEXT;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's Clerk ID
CREATE OR REPLACE FUNCTION public.get_clerk_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    NULL
  )::TEXT;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's database ID
CREATE OR REPLACE FUNCTION public.get_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE clerk_id = public.get_clerk_id();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is admin (super_admin or exam_coordinator)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('super_admin', 'exam_coordinator');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'super_admin';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is exam coordinator
CREATE OR REPLACE FUNCTION public.is_exam_coordinator()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'exam_coordinator';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is faculty
CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'faculty';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is student
CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'student';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (clerk_id = public.get_clerk_id());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (clerk_id = public.get_clerk_id())
  WITH CHECK (clerk_id = public.get_clerk_id());

-- Only super admins can insert users
CREATE POLICY "Super admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (public.is_super_admin());

-- Only super admins can delete users
CREATE POLICY "Super admins can delete users"
  ON public.users FOR DELETE
  USING (public.is_super_admin());

-- =====================================================
-- STUDENT PROFILES POLICIES
-- =====================================================

-- Students can view their own profile
CREATE POLICY "Students can view own profile"
  ON public.student_profiles FOR SELECT
  USING (user_id = public.get_user_id());

-- Faculty and admins can view all student profiles
CREATE POLICY "Faculty and admins can view student profiles"
  ON public.student_profiles FOR SELECT
  USING (public.get_user_role() IN ('faculty', 'exam_coordinator', 'super_admin'));

-- Admins can manage student profiles
CREATE POLICY "Admins can manage student profiles"
  ON public.student_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- FACULTY PROFILES POLICIES
-- =====================================================

-- Faculty can view their own profile
CREATE POLICY "Faculty can view own profile"
  ON public.faculty_profiles FOR SELECT
  USING (user_id = public.get_user_id());

-- All authenticated users can view faculty profiles (public directory)
CREATE POLICY "All can view faculty profiles"
  ON public.faculty_profiles FOR SELECT
  USING (public.get_clerk_id() IS NOT NULL);

-- Admins can manage faculty profiles
CREATE POLICY "Admins can manage faculty profiles"
  ON public.faculty_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- RESULTS POLICIES (CRITICAL FOR STUDENT PRIVACY)
-- =====================================================

-- Students can ONLY view their own published results
CREATE POLICY "Students can view own published results"
  ON public.results FOR SELECT
  USING (
    is_published = true 
    AND student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  );

-- Faculty can view published results
CREATE POLICY "Faculty can view published results"
  ON public.results FOR SELECT
  USING (public.is_faculty() AND is_published = true);

-- Exam coordinators can view and manage all results
CREATE POLICY "Exam coordinators can manage results"
  ON public.results FOR ALL
  USING (public.is_exam_coordinator())
  WITH CHECK (public.is_exam_coordinator());

-- Super admins can view all results
CREATE POLICY "Super admins can view all results"
  ON public.results FOR SELECT
  USING (public.is_super_admin());

-- Exam coordinators can publish results
CREATE POLICY "Exam coordinators can publish results"
  ON public.results FOR UPDATE
  USING (public.is_exam_coordinator())
  WITH CHECK (public.is_exam_coordinator());

-- =====================================================
-- EXAM SESSIONS POLICIES
-- =====================================================

-- All authenticated users can view published exam sessions
CREATE POLICY "All can view published exam sessions"
  ON public.exam_sessions FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Only exam coordinators and super admins can manage exam sessions
CREATE POLICY "Admins can manage exam sessions"
  ON public.exam_sessions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- HALL TICKETS POLICIES
-- =====================================================

-- Students can view their own hall tickets
CREATE POLICY "Students can view own hall tickets"
  ON public.hall_tickets FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  );

-- Admins can manage all hall tickets
CREATE POLICY "Admins can manage hall tickets"
  ON public.hall_tickets FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- ANNOUNCEMENTS POLICIES
-- =====================================================

-- All authenticated users can view published announcements
CREATE POLICY "All can view published announcements"
  ON public.announcements FOR SELECT
  USING (
    is_published = true 
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (
      'all' = ANY(target_audience)
      OR public.get_user_role() = ANY(target_audience)
    )
  );

-- Admins can view all announcements
CREATE POLICY "Admins can view all announcements"
  ON public.announcements FOR SELECT
  USING (public.is_admin());

-- Admins and faculty can create announcements
CREATE POLICY "Admins and faculty can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (public.get_user_role() IN ('faculty', 'exam_coordinator', 'super_admin'));

-- Users can update their own announcements
CREATE POLICY "Users can update own announcements"
  ON public.announcements FOR UPDATE
  USING (published_by = public.get_user_id())
  WITH CHECK (published_by = public.get_user_id());

-- Admins can update all announcements
CREATE POLICY "Admins can update all announcements"
  ON public.announcements FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- EVENTS POLICIES
-- =====================================================

-- All can view published events
CREATE POLICY "All can view published events"
  ON public.events FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Admins and faculty can create events
CREATE POLICY "Admins and faculty can create events"
  ON public.events FOR INSERT
  WITH CHECK (public.get_user_role() IN ('faculty', 'exam_coordinator', 'super_admin'));

-- Organizers can update their events
CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (organizer_id = public.get_user_id())
  WITH CHECK (organizer_id = public.get_user_id());

-- =====================================================
-- EVENT REGISTRATIONS POLICIES
-- =====================================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT
  USING (user_id = public.get_user_id());

-- Event organizers can view registrations for their events
CREATE POLICY "Organizers can view event registrations"
  ON public.event_registrations FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = public.get_user_id()
    )
  );

-- Users can register for events
CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (user_id = public.get_user_id());

-- Users can cancel their registrations
CREATE POLICY "Users can cancel registrations"
  ON public.event_registrations FOR UPDATE
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

-- =====================================================
-- PLACEMENT DRIVES POLICIES
-- =====================================================

-- All authenticated users can view active placement drives
CREATE POLICY "All can view active placement drives"
  ON public.placement_drives FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Admins can manage placement drives
CREATE POLICY "Admins can manage placement drives"
  ON public.placement_drives FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PLACEMENT APPLICATIONS POLICIES
-- =====================================================

-- Students can view their own applications
CREATE POLICY "Students can view own applications"
  ON public.placement_applications FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  );

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.placement_applications FOR SELECT
  USING (public.is_admin());

-- Students can apply to placement drives
CREATE POLICY "Students can apply to placements"
  ON public.placement_applications FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  );

-- Students can update their own applications
CREATE POLICY "Students can update own applications"
  ON public.placement_applications FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = public.get_user_id()
    )
  );

-- =====================================================
-- DOCUMENTS POLICIES
-- =====================================================

-- All can view public documents
CREATE POLICY "All can view public documents"
  ON public.documents FOR SELECT
  USING (is_public = true OR public.is_admin());

-- Faculty and admins can upload documents
CREATE POLICY "Faculty and admins can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (public.get_user_role() IN ('faculty', 'exam_coordinator', 'super_admin'));

-- Uploaders can update their documents
CREATE POLICY "Uploaders can update own documents"
  ON public.documents FOR UPDATE
  USING (uploaded_by = public.get_user_id())
  WITH CHECK (uploaded_by = public.get_user_id());

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_super_admin());

-- System can insert audit logs (service role)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- PUBLIC READ POLICIES (No authentication required)
-- =====================================================

-- Departments are publicly readable
CREATE POLICY "Departments are publicly readable"
  ON public.departments FOR SELECT
  USING (is_active = true);

-- Programs are publicly readable
CREATE POLICY "Programs are publicly readable"
  ON public.programs FOR SELECT
  USING (is_active = true);

-- Subjects are publicly readable
CREATE POLICY "Subjects are publicly readable"
  ON public.subjects FOR SELECT
  USING (is_active = true);

-- Exam timetables are publicly readable
CREATE POLICY "Exam timetables are publicly readable"
  ON public.exam_timetables FOR SELECT
  USING (true);

-- Companies are publicly readable
CREATE POLICY "Companies are publicly readable"
  ON public.companies FOR SELECT
  USING (is_active = true);

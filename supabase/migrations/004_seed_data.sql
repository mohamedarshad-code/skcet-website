-- SKCET Seed Data
-- Migration: 004_seed_data
-- Description: Sample data for development and testing

-- =====================================================
-- DEPARTMENTS
-- =====================================================

INSERT INTO public.departments (id, code, name, description, established_year, is_active) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'CSE', 'Computer Science and Engineering', 'Department of Computer Science and Engineering', 1985, true),
  ('d2222222-2222-2222-2222-222222222222', 'ECE', 'Electronics and Communication Engineering', 'Department of Electronics and Communication Engineering', 1985, true),
  ('d3333333-3333-3333-3333-333333333333', 'EEE', 'Electrical and Electronics Engineering', 'Department of Electrical and Electronics Engineering', 1985, true),
  ('d4444444-4444-4444-4444-444444444444', 'MECH', 'Mechanical Engineering', 'Department of Mechanical Engineering', 1985, true),
  ('d5555555-5555-5555-5555-555555555555', 'CIVIL', 'Civil Engineering', 'Department of Civil Engineering', 1985, true),
  ('d6666666-6666-6666-6666-666666666666', 'IT', 'Information Technology', 'Department of Information Technology', 2000, true),
  ('d7777777-7777-7777-7777-777777777777', 'AIDS', 'Artificial Intelligence and Data Science', 'Department of AI and Data Science', 2020, true),
  ('d8888888-8888-8888-8888-888888888888', 'CSBS', 'Computer Science and Business Systems', 'Department of Computer Science and Business Systems', 2021, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PROGRAMS
-- =====================================================

INSERT INTO public.programs (id, department_id, code, name, degree_type, duration_years, total_semesters, is_active) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CSE-UG', 'B.E Computer Science and Engineering', 'UG', 4, 8, true),
  ('a2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'ECE-UG', 'B.E Electronics and Communication Engineering', 'UG', 4, 8, true),
  ('a3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'EEE-UG', 'B.E Electrical and Electronics Engineering', 'UG', 4, 8, true),
  ('a4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 'MECH-UG', 'B.E Mechanical Engineering', 'UG', 4, 8, true),
  ('a5555555-5555-5555-5555-555555555555', 'd6666666-6666-6666-6666-666666666666', 'IT-UG', 'B.Tech Information Technology', 'UG', 4, 8, true),
  ('a6666666-6666-6666-6666-666666666666', 'd7777777-7777-7777-7777-777777777777', 'AIDS-UG', 'B.Tech Artificial Intelligence and Data Science', 'UG', 4, 8, true),
  ('a7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111', 'CSE-PG', 'M.E Computer Science and Engineering', 'PG', 2, 4, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SUBJECTS (Sample for CSE Department)
-- =====================================================

INSERT INTO public.subjects (id, code, name, department_id, semester, credits, subject_type, is_active) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'CS101', 'Programming in C', 'd1111111-1111-1111-1111-111111111111', 1, 4, 'theory', true),
  ('b2222222-2222-2222-2222-222222222222', 'CS102', 'Data Structures', 'd1111111-1111-1111-1111-111111111111', 3, 4, 'theory', true),
  ('b3333333-3333-3333-3333-333333333333', 'CS103', 'Database Management Systems', 'd1111111-1111-1111-1111-111111111111', 4, 4, 'theory', true),
  ('b4444444-4444-4444-4444-444444444444', 'CS104', 'Operating Systems', 'd1111111-1111-1111-1111-111111111111', 5, 4, 'theory', true),
  ('b5555555-5555-5555-5555-555555555555', 'CS105', 'Computer Networks', 'd1111111-1111-1111-1111-111111111111', 5, 4, 'theory', true),
  ('b6666666-6666-6666-6666-666666666666', 'CS106', 'Web Technologies', 'd1111111-1111-1111-1111-111111111111', 6, 3, 'theory', true),
  ('b7777777-7777-7777-7777-777777777777', 'CS107', 'Machine Learning', 'd1111111-1111-1111-1111-111111111111', 7, 4, 'theory', true),
  ('b8888888-8888-8888-8888-888888888888', 'CS108', 'Cloud Computing', 'd1111111-1111-1111-1111-111111111111', 7, 3, 'theory', true),
  ('b9999999-9999-9999-9999-999999999999', 'CS109', 'Data Structures Lab', 'd1111111-1111-1111-1111-111111111111', 3, 2, 'practical', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMPANIES (For Placements)
-- =====================================================

INSERT INTO public.companies (id, name, website, industry, description, is_active) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Google', 'https://google.com', 'Technology', 'Global technology company', true),
  ('c2222222-2222-2222-2222-222222222222', 'Microsoft', 'https://microsoft.com', 'Technology', 'Software and cloud services', true),
  ('c3333333-3333-3333-3333-333333333333', 'Amazon', 'https://amazon.com', 'E-commerce & Cloud', 'E-commerce and cloud computing', true),
  ('c4444444-4444-4444-4444-444444444444', 'TCS', 'https://tcs.com', 'IT Services', 'IT services and consulting', true),
  ('c5555555-5555-5555-5555-555555555555', 'Infosys', 'https://infosys.com', 'IT Services', 'IT services and consulting', true),
  ('c6666666-6666-6666-6666-666666666666', 'Wipro', 'https://wipro.com', 'IT Services', 'IT services and consulting', true),
  ('c7777777-7777-7777-7777-777777777777', 'Zoho', 'https://zoho.com', 'SaaS', 'Software as a Service products', true),
  ('c8888888-8888-8888-8888-888888888888', 'Cognizant', 'https://cognizant.com', 'IT Services', 'IT services and consulting', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SAMPLE ANNOUNCEMENTS
-- =====================================================

INSERT INTO public.announcements (
  id, title, content, category, priority, target_audience, 
  is_published, published_at
) VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'Semester Exam Schedule Released',
    'The schedule for the upcoming semester examinations has been released. Students are requested to check the timetable on the portal.',
    'exam',
    'high',
    ARRAY['student'],
    true,
    NOW() - INTERVAL '2 days'
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'Campus Placement Drive - Google',
    'Google will be conducting an on-campus placement drive for final year students. Eligible students can register through the placement portal.',
    'placement',
    'high',
    ARRAY['student'],
    true,
    NOW() - INTERVAL '1 day'
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'Technical Symposium - TechFest 2024',
    'Annual technical symposium TechFest 2024 will be conducted next month. Students are encouraged to participate in various technical events.',
    'event',
    'medium',
    ARRAY['all'],
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    'e4444444-4444-4444-4444-444444444444',
    'Library Timings Extended',
    'Library timings have been extended till 10 PM during the examination period.',
    'general',
    'low',
    ARRAY['all'],
    true,
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SAMPLE EVENTS
-- =====================================================

INSERT INTO public.events (
  id, title, description, event_type, venue, 
  start_datetime, end_datetime, registration_required, 
  max_participants, is_published
) VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'AI/ML Workshop',
    'Hands-on workshop on Artificial Intelligence and Machine Learning fundamentals',
    'workshop',
    'CSE Seminar Hall',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
    true,
    100,
    true
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'Annual Tech Fest',
    'Three-day technical festival featuring coding competitions, hackathons, and tech talks',
    'technical',
    'Main Auditorium',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '33 days',
    true,
    500,
    true
  ),
  (
    'f3333333-3333-3333-3333-333333333333',
    'Guest Lecture: Cloud Computing',
    'Industry expert talk on modern cloud computing practices',
    'seminar',
    'IT Department',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '2 hours',
    false,
    NULL,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SAMPLE PLACEMENT DRIVES
-- =====================================================

INSERT INTO public.placement_drives (
  id, company_id, title, description, job_role, 
  package_offered, batch_year, drive_date, 
  registration_deadline, is_active
) VALUES
  (
    'a1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111111',
    'Google - Software Engineer',
    'Google is hiring Software Engineers for their Bangalore office',
    'Software Engineer',
    '₹18-22 LPA',
    2024,
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '10 days',
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222223',
    'c2222222-2222-2222-2222-222222222222',
    'Microsoft - SDE Intern',
    'Microsoft Summer Internship Program for pre-final year students',
    'Software Development Engineer Intern',
    '₹80,000/month',
    2025,
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '7 days',
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333334',
    'c7777777-7777-7777-7777-777777777777',
    'Zoho - Member Technical Staff',
    'Zoho Corporation hiring for Member Technical Staff positions',
    'Member Technical Staff',
    '₹6-8 LPA',
    2024,
    NOW() + INTERVAL '25 days',
    NOW() + INTERVAL '12 days',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================

-- To create test users, you'll need to:
-- 1. Sign up through Clerk authentication
-- 2. The user will be created in Clerk
-- 3. Create corresponding record in public.users table with clerk_id
-- 4. Create student_profile or faculty_profile as needed

-- Example: After a student signs up with email test@skcet.ac.in
-- INSERT INTO public.users (clerk_id, email, first_name, last_name, role)
-- VALUES ('clerk_user_id_from_clerk', 'test@skcet.ac.in', 'Test', 'Student', 'student');

-- Then create student profile:
-- INSERT INTO public.student_profiles (user_id, register_number, department_id, batch_year, current_semester)
-- VALUES (
--   (SELECT id FROM public.users WHERE email = 'test@skcet.ac.in'),
--   '2021CSE001',
--   'd1111111-1111-1111-1111-111111111111',
--   2021,
--   6
-- );

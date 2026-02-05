-- SKCET Audit Logging and Additional Optimizations
-- Migration: 003_audit_triggers
-- Description: Automatic audit logging for compliance and additional database optimizations

-- =====================================================
-- AUDIT LOG TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  user_id_val UUID;
BEGIN
  -- Get user ID from current session
  SELECT id INTO user_id_val FROM public.users WHERE clerk_id = public.get_clerk_id();

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    user_id_val,
    TG_OP,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE
      WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)
      ELSE NULL
    END,
    CASE
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)
      ELSE NULL
    END,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );

  RETURN CASE
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- APPLY AUDIT TRIGGERS TO CRITICAL TABLES
-- =====================================================

-- Results (critical for compliance)
CREATE TRIGGER audit_results
  AFTER INSERT OR UPDATE OR DELETE ON public.results
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Exam sessions
CREATE TRIGGER audit_exam_sessions
  AFTER INSERT OR UPDATE OR DELETE ON public.exam_sessions
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- User management
CREATE TRIGGER audit_users
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Student profiles
CREATE TRIGGER audit_student_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Placement applications
CREATE TRIGGER audit_placement_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.placement_applications
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =====================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =====================================================

-- Student results summary (frequently accessed)
CREATE MATERIALIZED VIEW IF NOT EXISTS student_results_summary AS
SELECT 
  sp.id AS student_id,
  sp.register_number,
  u.email,
  u.first_name,
  u.last_name,
  sp.batch_year,
  sp.current_semester,
  d.name AS department_name,
  COUNT(r.id) AS total_exams,
  AVG(r.marks_obtained) AS average_marks,
  sp.cgpa
FROM public.student_profiles sp
JOIN public.users u ON sp.user_id = u.id
LEFT JOIN public.departments d ON sp.department_id = d.id
LEFT JOIN public.results r ON r.student_id = sp.id AND r.is_published = true
GROUP BY sp.id, sp.register_number, u.email, u.first_name, u.last_name, 
         sp.batch_year, sp.current_semester, d.name, sp.cgpa;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_student_results_summary_id ON student_results_summary(student_id);
CREATE INDEX idx_student_results_summary_register ON student_results_summary(register_number);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_student_results_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY student_results_summary;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ADDITIONAL COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Results lookup by student and session (very common query)
CREATE INDEX IF NOT EXISTS idx_results_student_session_published 
  ON public.results(student_id, exam_session_id, is_published) 
  INCLUDE (marks_obtained, grade, status);

-- Announcements for homepage (published, not expired, ordered by date)
-- Note: Removed NOW() from WHERE clause as it's not IMMUTABLE
CREATE INDEX IF NOT EXISTS idx_announcements_homepage 
  ON public.announcements(is_published, published_at DESC, expires_at) 
  WHERE is_published = true;

-- Placement drives for current batch
CREATE INDEX IF NOT EXISTS idx_placement_drives_current 
  ON public.placement_drives(batch_year, is_active, drive_date DESC) 
  WHERE is_active = true;

-- Event registrations count
CREATE INDEX IF NOT EXISTS idx_event_registrations_count 
  ON public.event_registrations(event_id, status) 
  WHERE status = 'registered';

-- Hall tickets lookup
CREATE INDEX IF NOT EXISTS idx_hall_tickets_lookup 
  ON public.hall_tickets(student_id, exam_session_id, is_active) 
  WHERE is_active = true;

-- =====================================================
-- FULL-TEXT SEARCH INDEXES
-- =====================================================

-- Add tsvector columns for full-text search
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update search vectors
UPDATE public.announcements SET search_vector = 
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''));

UPDATE public.events SET search_vector = 
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''));

UPDATE public.documents SET search_vector = 
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''));

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_announcements_search ON public.announcements USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_events_search ON public.events USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_documents_search ON public.documents USING GIN(search_vector);

-- Trigger to auto-update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'announcements' THEN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  ELSIF TG_TABLE_NAME = 'events' THEN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));
  ELSIF TG_TABLE_NAME = 'documents' THEN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_search_vector
  BEFORE INSERT OR UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER update_events_search_vector
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER update_documents_search_vector
  BEFORE INSERT OR UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- =====================================================
-- PARTITIONING FOR LARGE TABLES (Future-proofing)
-- =====================================================

-- Partition audit_logs by month (for better performance as it grows)
-- Note: This requires PostgreSQL 10+

-- Create partitioned table (if starting fresh)
-- CREATE TABLE public.audit_logs_partitioned (
--   LIKE public.audit_logs INCLUDING ALL
-- ) PARTITION BY RANGE (created_at);

-- Create partitions for each month (example)
-- CREATE TABLE audit_logs_2024_01 PARTITION OF public.audit_logs_partitioned
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to get student results by register number
CREATE OR REPLACE FUNCTION get_student_results(p_register_number TEXT)
RETURNS TABLE (
  subject_code TEXT,
  subject_name TEXT,
  marks_obtained INTEGER,
  grade TEXT,
  status TEXT,
  exam_name TEXT,
  semester INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.code,
    s.name,
    r.marks_obtained,
    r.grade,
    r.status,
    es.name,
    es.semester
  FROM public.results r
  JOIN public.subjects s ON r.subject_id = s.id
  JOIN public.exam_sessions es ON r.exam_session_id = es.id
  JOIN public.student_profiles sp ON r.student_id = sp.id
  WHERE sp.register_number = p_register_number
    AND r.is_published = true
  ORDER BY es.semester DESC, s.code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming events
CREATE OR REPLACE FUNCTION get_upcoming_events(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  event_type TEXT,
  venue TEXT,
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  department_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.event_type,
    e.venue,
    e.start_datetime,
    e.end_datetime,
    d.name
  FROM public.events e
  LEFT JOIN public.departments d ON e.department_id = d.id
  WHERE e.is_published = true
    AND e.start_datetime > NOW()
  ORDER BY e.start_datetime ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent announcements
CREATE OR REPLACE FUNCTION get_recent_announcements(
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  priority TEXT,
  published_at TIMESTAMPTZ,
  department_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.content,
    a.category,
    a.priority,
    a.published_at,
    d.name
  FROM public.announcements a
  LEFT JOIN public.departments d ON a.department_id = d.id
  WHERE a.is_published = true
    AND (a.expires_at IS NULL OR a.expires_at > NOW())
    AND (p_category IS NULL OR a.category = p_category)
  ORDER BY a.published_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STATISTICS AND MONITORING
-- =====================================================

-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create view for slow queries monitoring
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- queries taking more than 100ms on average
ORDER BY mean_exec_time DESC
LIMIT 50;

-- =====================================================
-- CLEANUP AND MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to archive old audit logs (run monthly)
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS void AS $$
BEGIN
  -- Archive logs older than 1 year to a separate table
  INSERT INTO public.audit_logs_archive
  SELECT * FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete archived logs from main table
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create archive table
CREATE TABLE IF NOT EXISTS public.audit_logs_archive (
  LIKE public.audit_logs INCLUDING ALL
);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.users IS 'Core users table synced with Clerk authentication';
COMMENT ON TABLE public.results IS 'Student exam results with RLS for privacy';
COMMENT ON TABLE public.audit_logs IS 'Compliance audit trail for all critical operations';
COMMENT ON FUNCTION get_student_results IS 'Retrieve all published results for a student by register number';
COMMENT ON FUNCTION refresh_student_results_summary IS 'Refresh materialized view for student results summary';

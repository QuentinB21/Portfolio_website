-- Daily retention for a single portfolio website. Invalid UUID/schema aborts the
-- transaction. Accounts, websites, reports and other websites are preserved.
BEGIN;
SET LOCAL statement_timeout = '60s';

CREATE TEMP TABLE retention_scope ON COMMIT DROP AS
SELECT :'website_id'::uuid AS website_id, CURRENT_TIMESTAMP - INTERVAL '6 months' AS cutoff;

DELETE FROM event_data d USING retention_scope r
WHERE d.website_id = r.website_id AND (
  d.created_at < r.cutoff OR EXISTS (
    SELECT 1 FROM website_event e
    WHERE e.event_id = d.website_event_id AND e.website_id = r.website_id AND e.created_at < r.cutoff
  )
);

DELETE FROM revenue d USING retention_scope r
WHERE d.website_id = r.website_id AND (
  d.created_at < r.cutoff OR EXISTS (
    SELECT 1 FROM website_event e
    WHERE e.event_id = d.event_id AND e.website_id = r.website_id AND e.created_at < r.cutoff
  )
);

DELETE FROM website_event e USING retention_scope r
WHERE e.website_id = r.website_id AND e.created_at < r.cutoff;

DELETE FROM session_data d USING retention_scope r
WHERE d.website_id = r.website_id AND (
  d.created_at < r.cutoff OR EXISTS (
    SELECT 1 FROM session s
    WHERE s.session_id = d.session_id AND s.website_id = r.website_id AND s.created_at < r.cutoff
      AND NOT EXISTS (SELECT 1 FROM website_event e WHERE e.session_id = s.session_id AND e.website_id = r.website_id)
  )
);

DELETE FROM session s USING retention_scope r
WHERE s.website_id = r.website_id AND s.created_at < r.cutoff
  AND NOT EXISTS (SELECT 1 FROM website_event e WHERE e.session_id = s.session_id AND e.website_id = r.website_id);

COMMIT;

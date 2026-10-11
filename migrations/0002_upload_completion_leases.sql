-- Completion leases allow retry after a Worker interruption without starting the upload again.
CREATE TABLE IF NOT EXISTS upload_completion_leases (upload_id TEXT PRIMARY KEY REFERENCES uploads(id) ON DELETE CASCADE, started_at INTEGER NOT NULL);

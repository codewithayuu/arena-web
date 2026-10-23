-- Apply to the Neon database configured as NEON_DATABASE_URL.
CREATE TABLE IF NOT EXISTS topic_comments (
  id text PRIMARY KEY,
  topic_id text NOT NULL,
  user_id text NOT NULL,
  author_name text NOT NULL,
  author_handle text NOT NULL,
  author_avatar text,
  author_tier text NOT NULL DEFAULT 'Member',
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 12000),
  parent_id text REFERENCES topic_comments(id) ON DELETE CASCADE,
  code_snippet text CHECK (code_snippet IS NULL OR length(code_snippet) <= 12000),
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (parent_id IS NULL OR parent_id <> id)
);

CREATE INDEX IF NOT EXISTS topic_comments_topic_created_idx
  ON topic_comments (topic_id, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS topic_comments_parent_idx
  ON topic_comments (parent_id) WHERE parent_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS topic_comment_votes (
  comment_id text NOT NULL REFERENCES topic_comments(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS problem_notes (
  user_id text NOT NULL,
  problem_id text NOT NULL,
  content text NOT NULL CHECK (length(content) <= 30000),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, problem_id)
);

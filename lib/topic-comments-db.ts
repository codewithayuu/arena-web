import "server-only";

import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export interface TopicComment {
  id: string;
  topic_id: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  author_tier?: string;
  content: string;
  created_at: string;
  upvotes: number;
  upvoted_by?: string[];
  replies?: TopicComment[];
  parent_id?: string | null;
  code_snippet?: string;
  is_pinned?: boolean;
}

function database() {
  // Neon CLI supplies DATABASE_URL; keep the existing explicit name supported
  // for deployments that already configure NEON_DATABASE_URL.
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Neon database is not configured");
  return neon(url);
}

interface CommentRow extends Omit<TopicComment, "replies" | "upvoted_by"> {
  parent_id: string | null;
  upvotes: number;
  user_voted: boolean;
}

const commentsCache = new Map<string, { data: { comments: TopicComment[]; hasMore: boolean; nextOffset: number }; expiresAt: number }>();

export function invalidateTopicCommentsCache(topicId?: string) {
  if (!topicId) {
    commentsCache.clear();
    return;
  }
  for (const key of commentsCache.keys()) {
    if (key.startsWith(`${topicId}:`)) {
      commentsCache.delete(key);
    }
  }
}

export async function getTopicComments(topicId: string, userId?: string, offset = 0, pageSize = 40): Promise<{ comments: TopicComment[]; hasMore: boolean; nextOffset: number }> {
  const cacheKey = `${topicId}:${userId ?? ""}:${offset}:${pageSize}`;
  const cached = commentsCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  const sql = database();
  const rootRows = await sql`
    SELECT c.id, c.topic_id, c.author_name, c.author_handle, c.author_avatar,
           c.author_tier, c.content, c.created_at::text AS created_at, c.parent_id,
           c.code_snippet, c.is_pinned,
           count(v.user_id)::int AS upvotes,
           coalesce(bool_or(v.user_id = ${userId ?? ""}), false) AS user_voted
      FROM topic_comments c
      LEFT JOIN topic_comment_votes v ON v.comment_id = c.id
     WHERE c.topic_id = ${topicId} AND c.parent_id IS NULL
     GROUP BY c.id
     ORDER BY c.is_pinned DESC, c.created_at DESC
     LIMIT ${pageSize + 1} OFFSET ${offset}` as unknown as CommentRow[];
  const hasMore = rootRows.length > pageSize;
  const pageRoots = rootRows.slice(0, pageSize);
  if (!pageRoots.length) return { comments: [], hasMore: false, nextOffset: offset };
  const rootIds = pageRoots.map((row) => row.id);
  const rows = await sql`
    WITH RECURSIVE thread AS (
      SELECT c.id, c.parent_id
        FROM topic_comments c
       WHERE c.topic_id = ${topicId} AND c.id = ANY(${rootIds}::text[])
      UNION ALL
      SELECT reply.id, reply.parent_id
        FROM topic_comments reply
        JOIN thread parent ON reply.parent_id = parent.id
       WHERE reply.topic_id = ${topicId}
    )
    SELECT c.id, c.topic_id, c.author_name, c.author_handle, c.author_avatar,
           c.author_tier, c.content, c.created_at::text AS created_at, c.parent_id,
           c.code_snippet, c.is_pinned,
           count(v.user_id)::int AS upvotes,
           coalesce(bool_or(v.user_id = ${userId ?? ""}), false) AS user_voted
      FROM topic_comments c
      JOIN thread t ON t.id = c.id
      LEFT JOIN topic_comment_votes v ON v.comment_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at ASC` as unknown as CommentRow[];

  const byId = new Map<string, TopicComment>();
  const roots: TopicComment[] = [];
  for (const row of rows) {
    const { user_voted: userVoted, ...commentRow } = row;
    byId.set(row.id, {
      ...commentRow,
      upvotes: Number(row.upvotes),
      upvoted_by: userVoted ? [userId ?? ""] : [],
      replies: [],
    });
  }
  for (const root of pageRoots) {
    const comment = byId.get(root.id);
    if (comment) roots.push(comment);
  }
  for (const row of rows) {
    const comment = byId.get(row.id)!;
    const parent = row.parent_id ? byId.get(row.parent_id) : undefined;
    if (parent) parent.replies!.push(comment);
  }
  const result = { comments: roots, hasMore, nextOffset: offset + pageRoots.length };
  commentsCache.set(cacheKey, { data: result, expiresAt: Date.now() + 30_000 });
  return result;
}

export async function addTopicComment(
  topicId: string,
  data: {
    userId: string;
    author_name: string;
    author_handle: string;
    author_avatar?: string;
    content: string;
    parent_id?: string | null;
    code_snippet?: string;
  },
): Promise<TopicComment | null> {
  const sql = database();
  const id = randomUUID();
  const rows = await sql`
    INSERT INTO topic_comments
      (id, topic_id, user_id, author_name, author_handle, author_avatar, author_tier,
       content, parent_id, code_snippet)
    SELECT ${id}, ${topicId}, ${data.userId}, ${data.author_name}, ${data.author_handle},
           ${data.author_avatar ?? null}, 'Member', ${data.content.trim()},
           parent.id, ${data.code_snippet?.trim() || null}
      FROM (SELECT 1) seed
      LEFT JOIN topic_comments parent
        ON parent.id = ${data.parent_id ?? null}
       AND parent.topic_id = ${topicId}
     WHERE ${data.parent_id ?? null}::text IS NULL OR parent.id IS NOT NULL
    RETURNING id, topic_id, author_name, author_handle, author_avatar, author_tier,
              content, created_at::text AS created_at, parent_id, code_snippet, is_pinned` as unknown as TopicComment[];
  if (!rows[0]) return null;
  invalidateTopicCommentsCache(topicId);
  return { ...rows[0], upvotes: 0, upvoted_by: [], replies: [] };
}

export async function upvoteComment(
  topicId: string,
  commentId: string,
  userId: string,
  voted: boolean,
): Promise<{ success: boolean; upvotes: number; userVoted: boolean }> {
  const sql = database();
  const rows = await sql`
    WITH target AS MATERIALIZED (
      SELECT id FROM topic_comments
       WHERE id = ${commentId} AND topic_id = ${topicId}
       FOR UPDATE
    ),
    before_count AS MATERIALIZED (
      SELECT count(v.user_id)::int AS value
        FROM topic_comment_votes v JOIN target t ON t.id = v.comment_id
    ),
    removed AS (
      DELETE FROM topic_comment_votes v USING target t
       WHERE v.comment_id = t.id AND v.user_id = ${userId} AND NOT ${voted}
      RETURNING v.user_id
    ),
    added AS (
      INSERT INTO topic_comment_votes (comment_id, user_id)
      SELECT t.id, ${userId} FROM target t WHERE ${voted}
      ON CONFLICT (comment_id, user_id) DO NOTHING
      RETURNING user_id
    )
    SELECT EXISTS (SELECT 1 FROM target) AS success,
           coalesce((SELECT value FROM before_count), 0)
             + (SELECT count(*) FROM added) - (SELECT count(*) FROM removed) AS upvotes,
           ${voted} AND EXISTS (SELECT 1 FROM target) AS user_voted` as unknown as { success: boolean; upvotes: number; user_voted: boolean }[];
  const row = rows[0];
  invalidateTopicCommentsCache(topicId);
  return {
    success: Boolean(row?.success),
    upvotes: Number(row?.upvotes ?? 0),
    userVoted: Boolean(row?.user_voted),
  };
}

export async function getProblemNote(userId: string, problemId: string): Promise<string> {
  const sql = database();
  const rows = await sql`
    SELECT content FROM problem_notes WHERE user_id = ${userId} AND problem_id = ${problemId}` as unknown as { content: string }[];
  return rows[0]?.content ?? "";
}

export async function saveProblemNote(userId: string, problemId: string, content: string): Promise<void> {
  const sql = database();
  await sql`
    INSERT INTO problem_notes (user_id, problem_id, content, updated_at)
    VALUES (${userId}, ${problemId}, ${content}, now())
    ON CONFLICT (user_id, problem_id)
    DO UPDATE SET content = EXCLUDED.content, updated_at = now()`;
}

export async function deleteMemberWebData(userId: string): Promise<void> {
  const sql = database();

  // Preserve replies written by other members. If their direct parent (or a
  // chain of parents) is being removed, attach them to the nearest surviving
  // ancestor, or make them roots when the deleted member owned the whole path.
  await sql`
    WITH RECURSIVE ancestry(descendant_id, ancestor_id, next_parent_id, ancestor_user_id, depth) AS (
      SELECT child.id, parent.id, parent.parent_id, parent.user_id, 1
        FROM topic_comments child
        JOIN topic_comments parent ON parent.id = child.parent_id
       WHERE child.user_id <> ${userId}
         AND parent.user_id = ${userId}
      UNION ALL
      SELECT ancestry.descendant_id, parent.id, parent.parent_id, parent.user_id, ancestry.depth + 1
        FROM ancestry
        JOIN topic_comments parent ON parent.id = ancestry.next_parent_id
       WHERE ancestry.ancestor_user_id = ${userId}
    ),
    reparent_targets AS (
      SELECT DISTINCT ON (descendant_id)
             descendant_id,
             CASE WHEN ancestor_user_id = ${userId} THEN NULL ELSE ancestor_id END AS parent_id
        FROM ancestry
       WHERE ancestor_user_id <> ${userId} OR next_parent_id IS NULL
       ORDER BY descendant_id, depth DESC
    )
    UPDATE topic_comments child
       SET parent_id = reparent_targets.parent_id
      FROM reparent_targets
     WHERE child.id = reparent_targets.descendant_id`;

  await sql`
    DELETE FROM topic_comment_votes
     WHERE user_id = ${userId}
        OR comment_id IN (SELECT id FROM topic_comments WHERE user_id = ${userId})`;
  await sql`DELETE FROM topic_comments WHERE user_id = ${userId}`;
  await sql`DELETE FROM problem_notes WHERE user_id = ${userId}`;
}

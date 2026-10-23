"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  MessageCircle,
  ThumbsUp,
  LogIn,
} from "lucide-react";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";
import Select from "@/components/smoothui/select";

interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  avatarBg: string;
  content: string;
  likes: number;
  isCreator?: boolean;
}

interface ApiComment {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  upvotes: number;
  upvoted_by?: string[];
  replies?: ApiComment[];
}

const INITIAL_COMMENTS: Comment[] = [];

export function CommentsSection() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const topicId = `lesson:${pathname || "unknown"}`;
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const loadComments = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments`, { cache: "no-store", signal });
      const body = await response.json();
      if (!response.ok || !Array.isArray(body.comments)) throw new Error(body.error || "Comments are temporarily unavailable");
      const toComment = (comment: ApiComment): Comment => ({
        id: comment.id,
        author: comment.author_name || comment.author_handle || "Member",
        timeAgo: new Date(comment.created_at).toLocaleString(),
        avatarBg: "bg-primary",
        content: comment.content,
        likes: Number(comment.upvotes) || 0,
      });
      setComments((body.comments as ApiComment[]).map(toComment));
      setLikesMap(Object.fromEntries((body.comments as ApiComment[]).map((comment) => [comment.id, Number(comment.upvotes) || 0])));
      setHasLikedMap(Object.fromEntries((body.comments as ApiComment[]).map((comment) => [comment.id, Boolean(comment.upvoted_by?.length)])));
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError(cause instanceof Error ? cause.message : "Comments are temporarily unavailable");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadComments(controller.signal);
    return () => controller.abort();
  }, [loadComments]);

  const toggleLike = async (id: string, initialLikes: number) => {
    const wasLiked = Boolean(hasLikedMap[id]);
    setError(null);
    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: id, voted: !wasLiked }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not update your vote");
      setHasLikedMap((prev) => ({ ...prev, [id]: Boolean(body.userVoted) }));
      setLikesMap((prev) => ({ ...prev, [id]: Number(body.upvotes ?? initialLikes) }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your vote");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || posting) return;
    setPosting(true);
    setError(null);
    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not post your comment");
      const created = body.comment as ApiComment;
      setComments((prev) => [{
        id: created.id,
        author: created.author_name || created.author_handle || "Member",
        timeAgo: "Just now",
        avatarBg: "bg-primary",
        content: created.content,
        likes: 0,
      }, ...prev]);
      setCommentText("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not post your comment");
    } finally {
      setPosting(false);
    }
  };

  const visibleComments = [...comments].sort((a, b) => sortBy === "top" ? (likesMap[b.id] ?? b.likes) - (likesMap[a.id] ?? a.likes) : 0);

  return (
    <div className="not-prose mt-12 pt-8 border-t border-border">
      {/* Comments Heading */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <span>Comments ({comments.length})</span>
        </h2>

        {/* Sort Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground shrink-0">Sort by</span>
          <div className="w-[105px] shrink-0">
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as any)}
              options={[
                { value: "top", label: "Top" },
                { value: "newest", label: "Newest" },
              ]}
              size="sm"
              className="h-7 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Comment Input Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md mb-8">
        <form onSubmit={handlePostComment} className="flex flex-col">
          <div className="p-4">
            <textarea
              aria-label="Write a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!isLoaded || !isSignedIn}
              placeholder="Add to the discussion..."
              rows={3}
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground outline-none resize-none"
            />
          </div>

          <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20 flex items-center justify-between flex-wrap gap-2">
            <SmoothButton
              type="submit"
              size="sm"
              variant="solid"
              color="accent"
              disabled={!isLoaded || !isSignedIn || !commentText.trim() || posting}
              className="font-semibold text-xs shadow-sm"
            >
              {posting ? "Posting…" : "Comment"}
            </SmoothButton>
          </div>
        </form>
      </div>

      {!isLoaded ? (
        <p role="status" className="mb-4 text-xs text-muted-foreground">Checking sign-in status…</p>
      ) : !isSignedIn ? (
        <p className="mb-4 text-sm text-muted-foreground">Sign in to comment or vote. <Link href="/sign-in" className="font-semibold text-primary underline underline-offset-4">Sign in</Link></p>
      ) : null}

      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-sm text-rose-600">{error}</p>}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p role="status" className="py-6 text-center text-sm text-muted-foreground">Loading comments…</p>
        ) : error && comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/5 py-8 px-4 text-center">
            <p className="text-sm font-medium text-foreground">Comments could not be loaded</p>
            <button type="button" onClick={() => void loadComments()} className="mt-3 text-sm font-semibold text-primary underline underline-offset-4">
              Try again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/5 py-10 px-4 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to share your thoughts, ask questions, or discuss this topic.
            </p>
          </div>
        ) : (
          visibleComments.map((c) => {
          const currentLikes = likesMap[c.id] ?? c.likes;
          const hasLiked = hasLikedMap[c.id];

          return (
            <div
              key={c.id}
              className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full ${c.avatarBg} text-white flex items-center justify-center text-xs font-bold shadow-sm`}
                  >
                    {c.author.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
                      {c.author}
                    </span>
                    {c.isCreator && (
                      <Badge
                        variant="outline"
                        size="sm"
                        className="text-[10px] py-0 px-1.5 font-bold border-primary/20 text-primary bg-primary/10"
                      >
                        Creator
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-[11px]">
                      {c.timeAgo}
                    </span>
                  </div>
                </div>

              </div>

              {/* Body */}
              <div className="p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {c.content}
              </div>

              {/* Footer Reactions */}
              <div className="px-4 py-2 border-t border-border/30 bg-muted/5 flex items-center gap-3">
                <SmoothButton
                  type="button"
                  size="xs"
                  variant={hasLiked ? "soft" : "ghost"}
                  color={hasLiked ? "accent" : "neutral"}
                  disabled={!isLoaded || !isSignedIn}
                  onClick={() => toggleLike(c.id, c.likes)}
                  className="gap-1.5"
                >
                  <ThumbsUp
                    className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
                  />
                  <span>{currentLikes}</span>
                </SmoothButton>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}

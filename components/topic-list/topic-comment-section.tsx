"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  MessageSquare,
  Heart,
  Reply,
  Code2,
  Send,
  Pin,
  Check,
  Copy,
  ChevronDown,
  Sparkles,
  Flame,
  Clock,
} from "lucide-react";
import Badge from "@/components/smoothui/badge";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import type { TopicComment } from "@/lib/topic-comments-db";

interface TopicCommentSectionProps {
  topicId: string;
  topicTitle: string;
}

export function TopicCommentSection({ topicId, topicTitle }: TopicCommentSectionProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  const [comments, setComments] = useState<TopicComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [commentsOffset, setCommentsOffset] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"top" | "newest">("top");

  // Main comment input state
  const [newContent, setNewContent] = useState("");
  const [newCodeSnippet, setNewCodeSnippet] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reply input state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Copied code feedback
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Upvoted map (client-side tracking)
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  // Fetch comments from DB
  const fetchComments = useCallback(async (offset = 0) => {
    if (offset === 0) {
      setIsLoading(true);
      setLoadError(null);
    } else setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments?offset=${offset}`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.comments)) {
        throw new Error(data.error || "Comments are temporarily unavailable");
      }
      setComments((current) => offset === 0 ? data.comments : [...current, ...data.comments]);
      setHasMoreComments(Boolean(data.hasMore));
      setCommentsOffset(Number(data.nextOffset) || 0);
      const nextVotes: Record<string, boolean> = {};
      const collectVotes = (items: TopicComment[]) => items.forEach((comment) => {
        if (comment.upvoted_by?.length) nextVotes[comment.id] = true;
        if (comment.replies?.length) collectVotes(comment.replies);
      });
      collectVotes(data.comments);
      setVotedMap((current) => ({ ...current, ...nextVotes }));
    } catch (error) {
      if (offset === 0) setLoadError(error instanceof Error ? error.message : "Comments are temporarily unavailable");
    } finally {
      if (offset === 0) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Format relative time helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "recently";
    }
  };

  // Submit main comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setSubmitError("Sign in to post a comment.");
      return;
    }
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent.trim(),
          code_snippet: showCodeInput && newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to post comment");
      }

      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewContent("");
        setNewCodeSnippet("");
        setShowCodeInput(false);
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit comment. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit reply
  const handlePostReply = async (parentId: string) => {
    if (!isSignedIn) {
      setSubmitError("Sign in to reply to a comment.");
      return;
    }
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);

    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          parent_id: parentId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          // Update nested reply in state
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), data.comment],
                };
              }
              return c;
            })
          );
          setReplyContent("");
          setReplyingToId(null);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Upvote comment
  const handleUpvote = async (commentId: string) => {
    if (!isSignedIn) {
      setSubmitError("Sign in to vote on comments.");
      return;
    }
    const isCurrentlyVoted = Boolean(votedMap[commentId]);

    // Optimistic UI update
    setVotedMap((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    setComments((prev) => {
      const updateList = (list: TopicComment[]): TopicComment[] =>
        list.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              upvotes: isCurrentlyVoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1,
            };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateList(c.replies) };
          }
          return c;
        });
      return updateList(prev);
    });

    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topicId)}/comments/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment_id: commentId,
          voted: !isCurrentlyVoted,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setVotedMap((prev) => ({ ...prev, [commentId]: data.userVoted }));
          setComments((prev) => {
            const updateList = (list: TopicComment[]): TopicComment[] => list.map((comment) => {
              if (comment.id === commentId) return { ...comment, upvotes: data.upvotes };
              return comment.replies?.length ? { ...comment, replies: updateList(comment.replies) } : comment;
            });
            return updateList(prev);
          });
        }
      } else {
        fetchComments();
      }
    } catch {
      // Revert if error
      fetchComments();
    }
  };

  // Copy code snippet helper
  const handleCopyCode = (snippet: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  // Sorted comments
  const sortedComments = [...comments].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    if (sortOrder === "top") {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalCommentCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-black p-5 sm:p-7 shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Discussions & Solutions</span>
              <Badge
                variant="outline"
                size="sm"
                className="font-mono text-xs border-white/15 bg-[#0a0a0c] text-sky-300"
              >
                {totalCommentCount}
              </Badge>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Discuss approaches, edge cases, and insights for {topicTitle}
            </p>
          </div>
        </div>

        {/* Sort Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-[#0a0a0c]">
          <button
            type="button"
            onClick={() => setSortOrder("top")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sortOrder === "top"
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Top</span>
          </button>
          <button
            type="button"
            onClick={() => setSortOrder("newest")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sortOrder === "newest"
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Newest</span>
          </button>
        </div>
      </div>

      {/* Main Comment Composer */}
      <form onSubmit={handlePostComment} className="mb-8">
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-4 transition-all focus-within:border-white/25 focus-within:ring-1 focus-within:ring-sky-500/30">
          {/* Identity Header */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              {isSignedIn && user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full ring-1 ring-white/20 object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[11px] font-bold">
                  {isLoaded ? "M" : "…"}
                </div>
              )}
              <span className="text-xs font-medium text-zinc-300">
                {!isLoaded
                  ? "Checking sign-in status…"
                  : isSignedIn && user
                    ? `${user.fullName || user.username || "Mindflare Member"} (Signed In)`
                    : "Sign in required to post"}
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            disabled={!isLoaded || !isSignedIn}
            placeholder={`Share an algorithmic intuition, helpful edge case, or question on ${topicTitle}...`}
            className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-zinc-500 focus:outline-none resize-y min-h-[70px] leading-relaxed"
          />

          {/* Optional Code Snippet Input Box */}
          {showCodeInput && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Code Snippet (C++ / Python / Java)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowCodeInput(false);
                    setNewCodeSnippet("");
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300"
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={4}
                value={newCodeSnippet}
                onChange={(e) => setNewCodeSnippet(e.target.value)}
                placeholder="// Paste code snippet or approach logic here..."
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs font-mono text-sky-300 placeholder:text-zinc-600 focus:outline-none focus:border-sky-500/40"
              />
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mt-2 text-xs text-rose-400 animate-in fade-in">
              {submitError}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.08] flex-wrap">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showCodeInput
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-400"
                  : "border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showCodeInput ? "Snippet Added" : "+ Add Code Snippet"}</span>
            </button>

            <button
              type="submit"
              disabled={!isLoaded || !isSignedIn || isSubmitting || !newContent.trim()}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ml-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
            </button>
            {!isSignedIn && isLoaded && <Link href="/sign-in" className="text-xs text-sky-400 underline underline-offset-4">Sign in to comment, reply, or vote</Link>}
          </div>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          Loading discussion entries...
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-xl border border-rose-500/25 bg-[#0a0a0c] p-8 text-center text-xs text-zinc-400">
          <p>{loadError}</p>
          <button type="button" onClick={() => void fetchComments()} className="mt-3 text-sky-400 underline underline-offset-4">Try again</button>
        </div>
      ) : sortedComments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0a0a0c] p-8 text-center text-xs text-zinc-500">
          <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
          <p className="text-zinc-400 font-medium mb-1">No comments yet on this topic.</p>
          <p className="text-zinc-500">Be the first to share your intuition, solution approach, or questions!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => {
            const isVoted = !!votedMap[comment.id];
            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="rounded-xl border border-white/10 bg-[#0a0a0c] p-4 sm:p-5 shadow-sm transition-all hover:border-white/15"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {comment.author_avatar ? (
                      <img
                        src={comment.author_avatar}
                        alt={comment.author_name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full ring-1 ring-white/15 bg-black object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 text-sky-300 border border-white/15 flex items-center justify-center text-xs font-bold">
                        {comment.author_name[0]?.toUpperCase() || "C"}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {comment.author_name}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          @{comment.author_handle}
                        </span>

                        {comment.author_tier && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="text-[10px] py-0 px-1.5 border-white/10 bg-black text-sky-400 font-medium"
                          >
                            {comment.author_tier}
                          </Badge>
                        )}

                        {comment.is_pinned && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="text-[10px] py-0 px-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold inline-flex items-center gap-1"
                          >
                            <Pin className="w-2.5 h-2.5 fill-amber-400" />
                            <span>Pinned Note</span>
                          </Badge>
                        )}
                      </div>

                      <span className="text-[11px] text-zinc-500">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-3 whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Attached Code Snippet if any */}
                {comment.code_snippet && (
                  <div className="relative mb-3.5 rounded-lg border border-white/10 bg-black overflow-hidden group">
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/[0.02] text-[11px] text-zinc-400">
                      <span className="font-mono flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Code Reference</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(comment.code_snippet!, comment.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {copiedSnippetId === comment.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
                      <code>{comment.code_snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Comment Action Buttons */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  {/* Upvote Button */}
                  <button
                    type="button"
                    disabled={!isLoaded || !isSignedIn}
                    onClick={() => handleUpvote(comment.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      isVoted
                        ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                        : "border-white/10 bg-black text-zinc-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isVoted ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                    <span className="font-mono text-[11px]">{comment.upvotes || 0}</span>
                  </button>

                  {/* Reply Button */}
                  <button
                    type="button"
                    disabled={!isLoaded || !isSignedIn}
                    onClick={() => {
                      if (isReplying) {
                        setReplyingToId(null);
                        setReplyContent("");
                      } else {
                        setReplyingToId(comment.id);
                        setReplyContent("");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-black text-zinc-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Inline Reply Composer */}
                {isReplying && (
                  <div className="mt-3.5 pt-3 border-t border-white/10 animate-in fade-in">
                    <div className="rounded-lg border border-white/10 bg-black p-3 space-y-2">
                      <textarea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={!isLoaded || !isSignedIn}
                        placeholder={`Reply to @${comment.author_handle}...`}
                        className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToId(null);
                            setReplyContent("");
                          }}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!isLoaded || !isSignedIn || isSubmittingReply || !replyContent.trim()}
                          onClick={() => handlePostReply(comment.id)}
                          className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black text-xs font-bold transition-all cursor-pointer"
                        >
                          {isSubmittingReply ? "Posting..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nested Threaded Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3.5 pl-3 sm:pl-4 border-l border-white/10 space-y-3">
                    {comment.replies.map((reply) => {
                      const isReplyVoted = !!votedMap[reply.id];
                      return (
                        <div
                          key={reply.id}
                          className="rounded-lg border border-white/[0.08] bg-black/50 p-3"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            {reply.author_avatar ? (
                              <img
                                src={reply.author_avatar}
                                alt={reply.author_name}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full ring-1 ring-white/15 object-cover"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                {reply.author_name[0]?.toUpperCase() || "R"}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-white">
                              {reply.author_name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              @{reply.author_handle}
                            </span>
                            <span className="text-[10px] text-zinc-500 ml-auto">
                              {formatTime(reply.created_at)}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-200 leading-relaxed mb-2 whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpvote(reply.id)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                                isReplyVoted
                                  ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                                  : "border-white/10 bg-black text-zinc-400 hover:text-white"
                              }`}
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  isReplyVoted ? "fill-rose-500 text-rose-500" : ""
                                }`}
                              />
                              <span className="font-mono">{reply.upvotes || 0}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {hasMoreComments && (
            <div className="pt-2 text-center">
              <button type="button" disabled={isLoadingMore} onClick={() => void fetchComments(commentsOffset)} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 disabled:opacity-50">
                {isLoadingMore ? "Loading…" : "Load more comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

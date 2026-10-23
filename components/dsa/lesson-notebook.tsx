"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BookOpenText, ChevronLeft, ChevronRight, FilePenLine, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import SmoothButton from "@/components/smoothui/smooth-button";
import Dialog from "@/components/smoothui/dialog";
import { getLessonBySlug } from "@/lib/dsa-curriculum";
import {
  createLearningNote,
  deleteLearningNote,
  loadLearningNotes,
  updateLearningNote,
  type LearningNote,
} from "@/lib/learning-notes-client";

type PanelMode = "note" | "notebook";
type LoadState = "loading" | "ready" | "error";

interface LessonNotebookProps {
  currentSlug: string;
  bookMode: boolean;
  onBookModeChange: (enabled: boolean) => void;
}

const GUEST_NOTES_KEY = "mindflare_guest_lesson_notes_v1";

function newDraftId() {
  return `draft-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`;
}

function readGuestNotes(): LearningNote[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_NOTES_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed as LearningNote[] : [];
  } catch {
    return [];
  }
}

export function LessonNotebook({ currentSlug, bookMode, onBookModeChange }: LessonNotebookProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mode, setMode] = useState<PanelMode | null>(null);
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notebookName, setNotebookName] = useState("DSA");
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pageTurning, setPageTurning] = useState(false);
  const lessonKey = `lesson:dsa:${currentSlug}`;
  const lessonTitle = getLessonBySlug(currentSlug)?.lesson.title ?? currentSlug.replace(/-/g, " ");

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    setMode(null);
    setSelectedId(null);
    setTitle("");
    setNotebookName("DSA");
    setContent("");
    setIsDirty(false);
    setMessage(null);
    setLoadState("loading");
    const load = async () => {
      if (isSignedIn && user?.id) {
        const accountNotes = await loadLearningNotes();
        if (cancelled) return;
        if (!accountNotes) {
          setLoadState("error");
          setNotes([]);
          return;
        }
        setNotes(accountNotes);
      } else {
        setNotes(readGuestNotes());
      }
      setLoadState("ready");
    };
    void load();
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, user?.id]);

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedId) ?? null, [notes, selectedId]);

  const startDraft = useCallback((targetLessonKey = lessonKey, targetTitle = lessonTitle) => {
    const existing = notes
      .filter((note) => note.lesson_key === targetLessonKey)
      .sort((left, right) => right.updated_at.localeCompare(left.updated_at))[0];
    if (existing) {
      setSelectedId(existing.id);
      setTitle(existing.title);
      setNotebookName(existing.notebook_name);
      setContent(existing.content);
      setIsDirty(false);
    } else {
      setSelectedId(newDraftId());
      setTitle(targetTitle);
      setNotebookName("DSA");
      setContent("");
      setIsDirty(false);
    }
    setMessage(null);
  }, [lessonKey, lessonTitle, notes]);

  const openPanel = (nextMode: PanelMode) => {
    setMode(nextMode);
    if (nextMode === "note") {
      startDraft();
      return;
    }

    const currentLessonNote = notes
      .filter((note) => note.lesson_key === lessonKey)
      .sort((left, right) => right.updated_at.localeCompare(left.updated_at))[0];
    const firstNote = currentLessonNote ?? [...notes].sort((left, right) => right.updated_at.localeCompare(left.updated_at))[0];
    if (firstNote) {
      setSelectedId(firstNote.id);
      setTitle(firstNote.title);
      setNotebookName(firstNote.notebook_name);
      setContent(firstNote.content);
      setIsDirty(false);
    } else {
      setSelectedId(null);
      setTitle(lessonTitle);
      setNotebookName("DSA");
      setContent("");
      setIsDirty(false);
    }
    setMessage(null);
  };

  const closePanel = (nextOpen: boolean) => {
    if (!nextOpen && isDirty && !window.confirm("Close without saving this note?")) return;
    setMode(nextOpen ? mode : null);
    setMessage(null);
  };

  const persistGuestNotes = (nextNotes: LearningNote[]) => {
    setNotes(nextNotes);
    try {
      localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(nextNotes));
      setLoadState("ready");
      return true;
    } catch {
      setMessage("This browser could not save the note. Keep this page open and try again.");
      return false;
    }
  };

  const saveCurrentNote = async () => {
    if (!title.trim() || !notebookName.trim()) {
      setMessage("Add a title and notebook name before saving.");
      return false;
    }
    if (content.length > 20_000) {
      setMessage("Keep each note under 20,000 characters.");
      return false;
    }
    setIsSaving(true);
    setMessage(null);
    const id = selectedId ?? newDraftId();
    const input = { title: title.trim(), notebook_name: notebookName.trim(), lesson_key: selectedNote?.lesson_key ?? lessonKey, content };
    let saved: LearningNote | null = null;
    try {
      if (isSignedIn && user?.id) {
        saved = id.startsWith("draft-")
          ? await createLearningNote(input)
          : await updateLearningNote(id, input);
      } else {
        const now = new Date().toISOString();
        saved = {
          id,
          ...input,
          created_at: notes.find((note) => note.id === id)?.created_at ?? now,
          updated_at: now,
        };
        const nextNotes = [saved, ...notes.filter((note) => note.id !== id)];
        if (!persistGuestNotes(nextNotes)) saved = null;
      }
    } finally {
      setIsSaving(false);
    }
    if (!saved) {
      setMessage(isSignedIn ? "Could not save to your account. Your text is still here; retry when connected." : "Could not save this note in the browser.");
      return false;
    }
    setNotes((current) => [saved!, ...current.filter((note) => note.id !== saved!.id)]);
    setSelectedId(saved.id);
    setIsDirty(false);
    setMessage("Saved");
    return true;
  };

  const removeCurrentNote = async () => {
    if (!selectedNote) return;
    setIsSaving(true);
    setMessage(null);
    let removed = false;
    if (isSignedIn && user?.id) {
      removed = await deleteLearningNote(selectedNote.id);
    } else {
      removed = persistGuestNotes(notes.filter((note) => note.id !== selectedNote.id));
    }
    setIsSaving(false);
    if (!removed) {
      setMessage("Could not delete this note. Try again.");
      return;
    }
    const remaining = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remaining);
    setSelectedId(null);
    setTitle(lessonTitle);
    setNotebookName("DSA");
    setContent("");
    setIsDirty(false);
    setMessage("Note deleted");
  };

  const discardChanges = () => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setNotebookName(selectedNote.notebook_name);
      setContent(selectedNote.content);
    } else {
      setSelectedId(null);
      setTitle(lessonTitle);
      setNotebookName("DSA");
      setContent("");
    }
    setIsDirty(false);
    setMessage(null);
  };

  const selectNote = (note: LearningNote) => {
    if (isDirty) {
      setMessage("Save or discard your current edits before turning to another page.");
      return;
    }
    if (note.id === selectedId) return;
    setPageTurning(true);
    window.setTimeout(() => {
      setSelectedId(note.id);
      setTitle(note.title);
      setNotebookName(note.notebook_name);
      setContent(note.content);
      setIsDirty(false);
      setPageTurning(false);
      setMessage(null);
    }, 220);
  };

  const createNewNote = () => {
    if (isDirty) {
      setMessage("Save or discard your current edits before creating another page.");
      return;
    }
    setSelectedId(newDraftId());
    setTitle(lessonTitle);
    setNotebookName("DSA");
    setContent("");
    setIsDirty(false);
    setMessage(null);
  };

  const groups = useMemo(() => {
    const grouped = new Map<string, LearningNote[]>();
    for (const note of notes) grouped.set(note.notebook_name, [...(grouped.get(note.notebook_name) ?? []), note]);
    return [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [notes]);
  const notebookPages = useMemo(() => groups.flatMap(([, groupNotes]) => groupNotes), [groups]);
  const selectedPageIndex = notebookPages.findIndex((note) => note.id === selectedId);
  const turnToPage = (direction: -1 | 1) => {
    const target = notebookPages[selectedPageIndex + direction];
    if (target) selectNote(target);
  };

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        <SmoothButton type="button" size="xs" variant="ghost" onClick={() => openPanel("note")} className="gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground" aria-label="Open lesson notes">
          <FilePenLine className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Notes</span>
        </SmoothButton>
        <SmoothButton type="button" size="xs" variant="ghost" onClick={() => openPanel("notebook")} className="gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground" aria-label="Open all notebooks">
          <BookOpenText className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Notebook</span>
        </SmoothButton>
      </div>

      <Dialog
        open={mode !== null}
        onOpenChange={closePanel}
        title={mode === "notebook" ? "Your notebooks" : "Lesson notes"}
        description={isSignedIn ? "Notes are saved to your Mindflare account." : "Guest notes stay in this browser. Sign in to keep notes with your account."}
        showCloseButton={false}
        className="!top-[50%] !left-[50%] !grid !h-[min(86dvh,760px)] !w-[min(96vw,980px)] !max-w-none !grid-rows-[auto_1fr] !overflow-hidden !rounded-2xl !border-zinc-800 !bg-[#070709] !p-0 !text-zinc-100"
      >
        <div className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{mode === "notebook" ? `${notes.length} ${notes.length === 1 ? "page" : "pages"}` : lessonTitle}</span>
              {loadState === "loading" && <span>· Loading</span>}
              {loadState === "error" && <span className="text-amber-300">· Account notes unavailable</span>}
            </div>
            <div className="flex items-center gap-2">
              <SmoothButton type="button" size="xs" variant="outline" onClick={createNewNote} className="gap-1.5 border-zinc-700 bg-black text-zinc-200 hover:bg-zinc-900">
                <Plus className="h-3.5 w-3.5" /> New note
              </SmoothButton>
              <button type="button" onClick={() => closePanel(false)} aria-label="Close notebook" className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040]">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
            {mode === "notebook" && (
              <aside aria-label="Notes grouped by notebook" className="max-h-40 overflow-y-auto border-b border-zinc-800 bg-[#050506] p-3 md:max-h-none md:border-b-0 md:border-r">
                {groups.length === 0 ? (
                  <p className="px-2 py-4 text-xs leading-relaxed text-zinc-500">Your notebook is empty. Create a note to start collecting lesson ideas.</p>
                ) : groups.map(([groupName, groupNotes]) => (
                  <section key={groupName} className="mb-4">
                    <h3 className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{groupName}</h3>
                    <ul className="space-y-1">
                      {groupNotes.map((note) => (
                        <li key={note.id}>
                          <button
                            type="button"
                            onClick={() => selectNote(note)}
                            aria-current={selectedId === note.id ? "true" : undefined}
                            className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] ${selectedId === note.id ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200"}`}
                          >
                            <span className="block truncate text-xs font-medium">{note.title}</span>
                            <span className="mt-1 block truncate text-[10px] text-zinc-600">{getLessonBySlug(note.lesson_key.replace("lesson:dsa:", ""))?.lesson.title ?? note.lesson_key}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </aside>
            )}

            <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
              <div className={`notebook-page mx-auto flex min-h-full max-w-2xl flex-col ${pageTurning ? "notebook-page-turn" : ""}`}>
                {mode === "notebook" && notebookPages.length > 1 && (
                  <nav aria-label="Notebook pages" className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <SmoothButton
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={() => turnToPage(-1)}
                      disabled={isDirty || isSaving || selectedPageIndex <= 0}
                      aria-label="Previous notebook page"
                      className="gap-1 border-zinc-700 bg-[#09090b] text-zinc-300"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </SmoothButton>
                    <span className="text-xs tabular-nums text-zinc-500">
                      {selectedPageIndex < 0 ? "—" : selectedPageIndex + 1} / {notebookPages.length}
                    </span>
                    <SmoothButton
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={() => turnToPage(1)}
                      disabled={isDirty || isSaving || selectedPageIndex < 0 || selectedPageIndex >= notebookPages.length - 1}
                      aria-label="Next notebook page"
                      className="gap-1 border-zinc-700 bg-[#09090b] text-zinc-300"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </SmoothButton>
                  </nav>
                )}
                {selectedNote && mode === "notebook" && (
                  <Link href={getLessonBySlug(selectedNote.lesson_key.replace("lesson:dsa:", ""))?.lesson.href ?? "/learn/dsa/course-introduction"} className="mb-4 inline-flex w-fit items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200">
                    <BookOpenText className="h-3.5 w-3.5" /> Open this lesson
                  </Link>
                )}
                <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500" htmlFor="lesson-note-title">Page title</label>
                <input
                  id="lesson-note-title"
                  value={title}
                  onChange={(event) => { setTitle(event.target.value); setIsDirty(true); }}
                  maxLength={120}
                  placeholder="Give this note a title"
                  className="w-full border-0 border-b border-zinc-800 bg-transparent px-0 py-2 text-lg font-semibold text-white outline-none placeholder:text-zinc-700 focus:border-zinc-500"
                />
                <label className="mb-1 mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500" htmlFor="lesson-note-notebook">Notebook</label>
                <input
                  id="lesson-note-notebook"
                  value={notebookName}
                  onChange={(event) => { setNotebookName(event.target.value); setIsDirty(true); }}
                  maxLength={80}
                  placeholder="DSA"
                  className="w-full rounded-lg border border-zinc-800 bg-[#0c0c0f] px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
                />
                <label className="mb-1 mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500" htmlFor="lesson-note-content">Notes</label>
                <textarea
                  id="lesson-note-content"
                  value={content}
                  onChange={(event) => { setContent(event.target.value); setIsDirty(true); }}
                  maxLength={20_000}
                  placeholder="Write down an idea, edge case, or question from this lesson…"
                  className="min-h-48 flex-1 resize-y rounded-xl border border-zinc-800 bg-[#0c0c0f] p-4 text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600 sm:min-h-64"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p role="status" className={`min-h-5 text-xs ${message && message !== "Saved" && message !== "Note deleted" ? "text-amber-300" : "text-zinc-500"}`}>
                    {message ?? (isDirty ? "Unsaved changes" : `${content.length.toLocaleString()} / 20,000`)}
                  </p>
                  <div className="flex items-center gap-2">
                    {isDirty && (
                      <SmoothButton type="button" size="xs" variant="ghost" onClick={discardChanges} disabled={isSaving} className="text-zinc-400 hover:text-zinc-100">
                        Discard
                      </SmoothButton>
                    )}
                    {selectedNote && (
                      <SmoothButton type="button" size="xs" variant="ghost" onClick={() => void removeCurrentNote()} disabled={isSaving} className="gap-1.5 text-zinc-400 hover:text-red-300">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </SmoothButton>
                    )}
                    <SmoothButton type="button" size="xs" variant="solid" color="accent" onClick={() => void saveCurrentNote()} disabled={isSaving || !isDirty} className="min-w-20 gap-1.5">
                      <FilePenLine className="h-3.5 w-3.5" /> {isSaving ? "Saving…" : "Save"}
                    </SmoothButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .notebook-page-turn { animation: notebook-page-fold 220ms ease-out both; transform-origin: left center; }
          @keyframes notebook-page-fold { from { opacity: .35; transform: perspective(900px) rotateY(-12deg); } to { opacity: 1; transform: perspective(900px) rotateY(0); } }
          @media (prefers-reduced-motion: reduce) { .notebook-page-turn { animation-duration: 1ms; } }
        `}</style>
      </Dialog>
      <SmoothButton
        type="button"
        size="icon-sm"
        variant={bookMode ? "solid" : "ghost"}
        color={bookMode ? "accent" : "neutral"}
        onClick={() => onBookModeChange(!bookMode)}
        aria-label={bookMode ? "Exit book reading mode" : "Read as book"}
        className="text-muted-foreground hover:text-foreground"
      >
        <BookOpenText className="h-4 w-4" />
      </SmoothButton>
    </>
  );
}

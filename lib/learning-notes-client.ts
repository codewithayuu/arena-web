export interface LearningNote {
  id: string;
  notebook_name: string;
  lesson_key: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type LearningNoteInput = Pick<LearningNote, "notebook_name" | "lesson_key" | "title" | "content">;

export async function loadLearningNotes(): Promise<LearningNote[] | null> {
  try {
    const response = await fetch("/api/learning/notes", { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json() as { notes?: LearningNote[] };
    return Array.isArray(payload.notes) ? payload.notes : null;
  } catch {
    return null;
  }
}

export async function createLearningNote(input: LearningNoteInput): Promise<LearningNote | null> {
  try {
    const response = await fetch("/api/learning/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        notebookName: input.notebook_name,
        lessonKey: input.lesson_key,
        title: input.title,
        content: input.content,
      }),
    });
    if (!response.ok) return null;
    const payload = await response.json() as { note?: LearningNote };
    return payload.note ?? null;
  } catch {
    return null;
  }
}


export async function updateLearningNote(id: string, input: Partial<LearningNoteInput>): Promise<LearningNote | null> {
  try {
    const response = await fetch(`/api/learning/notes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...(input.notebook_name !== undefined ? { notebookName: input.notebook_name } : {}),
        ...(input.lesson_key !== undefined ? { lessonKey: input.lesson_key } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
      }),
    });
    if (!response.ok) return null;
    const payload = await response.json() as { note?: LearningNote };
    return payload.note as LearningNote | undefined ?? null;
  } catch {
    return null;
  }
}

export async function deleteLearningNote(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/learning/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
    return response.ok;
  } catch {
    return false;
  }
}

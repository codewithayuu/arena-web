import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_DRAFT_ENTRIES,
  MAX_DRAFT_TOTAL_BYTES,
  isContestDraftReady,
  type ContestDraftStorage,
  readContestDrafts,
  writeContestDrafts,
} from "@/lib/contest-drafts";

test("contest editor waits for the selected account, contest, problem, and language draft", () => {
  assert.equal(isContestDraftReady("user-a:contest-a", "user-a:contest-a", "problem-a:cpp17", "problem-a:cpp17"), true);
  assert.equal(isContestDraftReady("user-a:contest-a", "user-a:contest-a", "problem-a:cpp17", "problem-b:cpp17"), false);
  assert.equal(isContestDraftReady("user-a:contest-a", "user-a:contest-a", "problem-a:cpp17", "problem-a:java"), false);
  assert.equal(isContestDraftReady("user-a:contest-a", "user-b:contest-a", "problem-a:cpp17", "problem-a:cpp17"), false);
  assert.equal(isContestDraftReady(null, "user-a:contest-a", "problem-a:cpp17", "problem-a:cpp17"), false);
  assert.equal(isContestDraftReady("user-a:contest-a", null, "problem-a:cpp17", "problem-a:cpp17"), false);
});

class MemoryStorage implements ContestDraftStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

test("contest drafts round-trip through storage and stay scoped by account and contest key", () => {
  const storage = new MemoryStorage();
  const accountContestKey = "mindflare:contest-drafts:v1:user-1:contest-1";
  assert.equal(writeContestDrafts(storage, accountContestKey, { "p1:cpp20": "int main() {}" }), true);

  // Reading again from persistent storage represents a newly loaded page.
  assert.deepEqual(readContestDrafts(storage, accountContestKey), { "p1:cpp20": "int main() {}" });
  assert.deepEqual(readContestDrafts(storage, "mindflare:contest-drafts:v1:user-2:contest-1"), {});
  assert.deepEqual(readContestDrafts(storage, "mindflare:contest-drafts:v1:user-1:contest-2"), {});
});

test("contest draft storage enforces entry and aggregate byte bounds", () => {
  const storage = new MemoryStorage();
  const manyEntries = Object.fromEntries(
    Array.from({ length: MAX_DRAFT_ENTRIES + 10 }, (_, index) => [`problem-${index}:cpp17`, `source-${index}`]),
  );
  assert.equal(writeContestDrafts(storage, "bounded", manyEntries), true);
  const restored = readContestDrafts(storage, "bounded");
  assert.equal(Object.keys(restored).length, MAX_DRAFT_ENTRIES);
  assert.ok(!("problem-0:cpp17" in restored));
  assert.ok("problem-265:cpp17" in restored);

  const aggregate = Object.fromEntries(
    Array.from({ length: 8 }, (_, index) => [`problem-${index}:cpp20`, "x".repeat(200_000)]),
  );
  assert.equal(writeContestDrafts(storage, "aggregate", aggregate), true);
  const bounded = readContestDrafts(storage, "aggregate");
  assert.equal(Object.keys(bounded).length, 7);
  assert.ok(Object.values(bounded).every((source) => source.length === 200_000));
});

test("contest draft storage failure is reported without throwing", () => {
  const unavailable: ContestDraftStorage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("quota"); },
  };
  assert.deepEqual(readContestDrafts(unavailable, "key"), {});
  assert.equal(writeContestDrafts(unavailable, "key", { source: "draft" }), false);
  assert.deepEqual(readContestDrafts(null, "key"), {});
});

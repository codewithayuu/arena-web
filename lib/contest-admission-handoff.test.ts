import assert from "node:assert/strict";
import test from "node:test";
import {
  clearContestAdmissionHandoff,
  loadContestAdmissionHandoff,
  storeContestAdmissionHandoff,
  type ContestHandoffStorage,
} from "./contest-admission-handoff";
import type { AdmissionHandoff } from "./runtime-bridge";

const contestId = "10000000-0000-4000-8000-000000000001";
const handoff: AdmissionHandoff = {
  challenge_id: "20000000-0000-4000-8000-000000000001",
  policy_revision: 7,
  policy_digest: "a".repeat(64),
  device_id: "30000000-0000-4000-8000-000000000001",
  idempotency_key: "40000000-0000-4000-8000-000000000001",
};

class MemoryStorage implements ContestHandoffStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

test("contest admission handoff retains only idempotent metadata for active-lease replay", () => {
    const storage = new MemoryStorage();
    assert.equal(storeContestAdmissionHandoff(storage, contestId, handoff, 1_000), true);

    const raw = [...storage.values.values()][0];
    assert.doesNotMatch(raw, /lease_token/);
    assert.deepEqual(loadContestAdmissionHandoff(storage, contestId, {
      revision: handoff.policy_revision,
      digest: handoff.policy_digest,
    }, 86_400_000), handoff);
});

test("contest admission handoff is discarded when contest policy changes", () => {
    const storage = new MemoryStorage();
    storeContestAdmissionHandoff(storage, contestId, handoff);

    assert.equal(loadContestAdmissionHandoff(storage, contestId, {
      revision: handoff.policy_revision + 1,
      digest: "b".repeat(64),
    }), null);
    assert.equal(storage.values.size, 0);
});

test("contest admission handoff rejects stored lease tokens and unknown fields", () => {
    const storage = new MemoryStorage();
    storeContestAdmissionHandoff(storage, contestId, handoff);
    const [key, raw] = [...storage.values.entries()][0];
    const stored = JSON.parse(raw) as { handoff: Record<string, unknown> };
    stored.handoff.lease_token = "must-not-be-forwarded";
    storage.values.set(key, JSON.stringify(stored));

    assert.equal(loadContestAdmissionHandoff(storage, contestId, {
      revision: handoff.policy_revision,
      digest: handoff.policy_digest,
    }), null);
    assert.equal(storage.values.size, 0);
});

test("disabled browser storage does not break the page flow", () => {
    const unavailable: ContestHandoffStorage = {
      getItem() { throw new Error("storage disabled"); },
      setItem() { throw new Error("storage disabled"); },
      removeItem() { throw new Error("storage disabled"); },
    };
    assert.equal(storeContestAdmissionHandoff(unavailable, contestId, handoff), false);
    assert.equal(loadContestAdmissionHandoff(unavailable, contestId, {
      revision: handoff.policy_revision,
      digest: handoff.policy_digest,
    }), null);
    assert.doesNotThrow(() => clearContestAdmissionHandoff(unavailable, contestId));
});

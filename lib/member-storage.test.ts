import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { memberStorageKey } from "./member-storage";

describe("memberStorageKey", () => {
  it("isolates browser state between Clerk members", () => {
    assert.notEqual(memberStorageKey("saved-topics", "user_alpha"), memberStorageKey("saved-topics", "user_beta"));
  });

  it("keeps guest storage on its existing device-local key", () => {
    assert.equal(memberStorageKey("saved-topics", null), "saved-topics");
  });
});

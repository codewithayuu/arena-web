import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAuthModeHref, safePostAuthUrl } from "./auth-redirect";

describe("safePostAuthUrl", () => {
  it("keeps an internal path and query after sign-in", () => {
    assert.equal(safePostAuthUrl("/practice/dsa?tab=starred", "https://arena.example"), "/practice/dsa?tab=starred");
  });

  it("rejects external redirects and auth loops", () => {
    assert.equal(safePostAuthUrl("https://evil.example/", "https://arena.example"), "/");
    assert.equal(safePostAuthUrl("//evil.example/", "https://arena.example"), "/");
    assert.equal(safePostAuthUrl("/sign-in?redirect_url=/sign-in", "https://arena.example"), "/");
  });

  it("preserves a safe destination while switching between auth modes", () => {
    assert.equal(buildAuthModeHref("signup", "/practice/dsa?tab=starred"), "/sign-up?redirect_url=%2Fpractice%2Fdsa%3Ftab%3Dstarred");
    assert.equal(buildAuthModeHref("login", "https://evil.example/"), "/sign-in");
  });
});

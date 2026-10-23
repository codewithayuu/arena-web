import assert from "node:assert/strict";
import test from "node:test";
import {
  getContestClockState,
  getContestPhaseLabel,
  getServerCountdownRemainingSeconds,
} from "@/lib/contest-clock";

const start = Date.parse("2030-01-02T03:00:00Z");
const end = Date.parse("2030-01-02T04:00:00Z");

test("contest clock counts toward server-published start and end boundaries", () => {
  assert.deepEqual(getContestClockState(start - 1_500, start, end), { phase: "upcoming", remainingSeconds: 2 });
  assert.deepEqual(getContestClockState(start, start, end), { phase: "active", remainingSeconds: 3600 });
  assert.deepEqual(getContestClockState(end, start, end), { phase: "ended", remainingSeconds: 0 });
});

test("invalid clock or schedule values fail to an unavailable display state", () => {
  assert.deepEqual(getContestClockState(Number.NaN, start, end), { phase: "unavailable", remainingSeconds: 0 });
  assert.deepEqual(getContestClockState(start, end, start), { phase: "unavailable", remainingSeconds: 0 });
});

test("contest phase labels distinguish upcoming, live, ended, and unavailable displays", () => {
  assert.equal(getContestPhaseLabel("upcoming"), "Upcoming");
  assert.equal(getContestPhaseLabel("active"), "Live");
  assert.equal(getContestPhaseLabel("ended"), "Ended");
  assert.equal(getContestPhaseLabel("unavailable"), "Schedule unavailable");
  assert.equal(getContestPhaseLabel(null), "Checking schedule");
});

test("server countdown advances from its monotonic anchor without consulting wall-clock time", () => {
  const serverSnapshot = Date.parse("2030-01-02T02:59:50Z");
  const target = start;
  assert.equal(getServerCountdownRemainingSeconds(serverSnapshot, 500, 500, target), 10);
  assert.equal(getServerCountdownRemainingSeconds(serverSnapshot, 500, 1_501, target), 9);
  assert.equal(getServerCountdownRemainingSeconds(serverSnapshot, 500, 10_500, target), 0);
});

test("server countdown clamps a regressed monotonic sample and rejects invalid anchors", () => {
  assert.equal(getServerCountdownRemainingSeconds(start - 1_500, 100, 50, start), 2);
  assert.equal(getServerCountdownRemainingSeconds(Number.NaN, 100, 200, start), null);
  assert.equal(getServerCountdownRemainingSeconds(start, 100, 200, Number.POSITIVE_INFINITY), null);
});

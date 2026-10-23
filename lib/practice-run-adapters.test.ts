import assert from "node:assert/strict";
import test from "node:test";
import { getAllPracticeProblems, PRACTICE_PROBLEMS } from "@/lib/practice-problems";
import {
  makePracticeExecution,
  supportsPracticeHarness,
} from "@/lib/practice-run-adapters";
import { PRACTICE_TEST_PACKS } from "@/lib/practice-test-packs.server";

const moveZeroes = PRACTICE_PROBLEMS.find((problem) => problem.id === "move-zeroes");
const rotateArray = PRACTICE_PROBLEMS.find((problem) => problem.id === "rotate-array");

test("practice harness accepts signed 32-bit boundary values", () => {
  assert.ok(moveZeroes);
  const execution = makePracticeExecution(
    moveZeroes,
    "C++",
    "class Solution { public: void moveZeroes(vector<int>& nums) {} };",
    [-2_147_483_648, 2_147_483_647],
  );
  assert.match(execution.stdin, /-2147483648/);
  assert.match(execution.stdin, /2147483647/);
  assert.match(execution.source, /parseIntArray/);
  assert.match(execution.source, /stoi\(it->str\(\)\)/);
});

test("practice harness rejects integers that overflow C++ and Java int", () => {
  assert.ok(moveZeroes);
  assert.throws(() => makePracticeExecution(moveZeroes, "C++", "", [2_147_483_648]));
  assert.throws(() => makePracticeExecution(moveZeroes, "Java", "", [-2_147_483_649]));
});

test("rotation harness rejects a negative int argument", () => {
  assert.ok(rotateArray);
  assert.throws(() => makePracticeExecution(rotateArray, "C++", "", [[1, 2, 3], -1]));
});

test("system availability supports object arguments and float results in four languages", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "calculate-system-availability");
  assert.ok(problem);
  const caseInput = PRACTICE_TEST_PACKS[problem.id][0].rawInput;
  for (const language of ["C++", "Java", "Python", "JavaScript"] as const) {
    assert.ok(supportsPracticeHarness(problem, language));
    const execution = makePracticeExecution(problem, language, "class Solution {}", caseInput);
    assert.match(execution.stdin, /0\.99/);
    assert.match(execution.stdin, /series/);
    assert.match(execution.source, /calculateAvailability/);
  }
  const cpp = makePracticeExecution(problem, "C++", "class Solution {}", caseInput);
  assert.match(cpp.source, /vector<double> arg0 = parseDoubleArray/);
  assert.match(cpp.source, /setprecision\(15\)/);
});

test("token bucket harness preserves nested integer-array arguments", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "design-token-bucket-rate-limiter");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][0].rawInput;
  const execution = makePracticeExecution(problem, "C++", "class Solution {}", input);
  assert.match(execution.stdin, /\[\[0,3\],\[1,2\],\[1,2\]\]/);
  assert.match(execution.source, /parseIntMatrix/);
  assert.match(execution.source, /vector<bool>/);
});

test("FooBar runs both callbacks concurrently and checks their real output order", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "print-foobar-alternately");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][1].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["thread foo_thread", "foo_thread.join()", "bar_thread.join()"]],
    ["Java", ["Executors.newFixedThreadPool(2)", "foo.get()", "bar.get()"]],
    ["Python", ["ThreadPoolExecutor(max_workers=2)", "_foo.result()", "_bar.result()"]],
    ["JavaScript", ["Promise.all", "_solution.foo(", "_solution.bar("]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class FooBar {}", input);
    assert.equal(execution.stdin, "2\n");
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
  assert.throws(() => makePracticeExecution(problem, "Python", "", 0), /between 1 and 1000/);
  assert.throws(() => makePracticeExecution(problem, "Python", "", 1001), /between 1 and 1000/);
});

test("ZeroEvenOdd starts all three candidate methods concurrently", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "zero-even-odd");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][1].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["thread zero_thread", "thread odd_thread", "thread even_thread"]],
    ["Java", ["Executors.newFixedThreadPool(3)", "solution.zero(", "solution.odd(", "solution.even("]],
    ["Python", ["ThreadPoolExecutor(max_workers=3)", "_solution.zero", "_solution.odd", "_solution.even"]],
    ["JavaScript", ["Promise.all", "_solution.zero(", "_solution.odd(", "_solution.even("]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class ZeroEvenOdd {}", input);
    assert.equal(execution.stdin, "5\n");
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
});

test("bounded queue harness fills before running a concurrent producer and consumer", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "design-bounded-blocking-queue");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][0].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["thread producer", "thread consumer", "queue.size() > capacity"]],
    ["Java", ["CountDownLatch started", "Thread producer", "Thread consumer"]],
    ["Python", ["threading.Event()", "threading.Thread(target=_produce)", "threading.Thread(target=_consume)"]],
    ["JavaScript", ["await _queue.enqueue(item)", "const producer =", "const consumer ="]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class BoundedBlockingQueue {}", input);
    assert.match(execution.stdin, /2\n\[10,20,30,40,50\]/);
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
  assert.throws(() => makePracticeExecution(problem, "Python", "", { capacity: 2, items: [1, 2] }), /more items than capacity/);
});

test("H2O runs every atom method concurrently and validates molecule groups", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "building-h2o-molecule");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][1].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["workers.emplace_back", "solution.hydrogen", "solution.oxygen", "group.begin()"]],
    ["Java", ["newFixedThreadPool(water.length())", "solution.hydrogen", "solution.oxygen", "task.get()"]],
    ["Python", ["ThreadPoolExecutor(max_workers=len(_water))", "_pool.map(_run, _water)", "Invalid molecule group"]],
    ["JavaScript", ["Promise.all([..._water]", "_solution.hydrogen", "_solution.oxygen", "Invalid molecule group"]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class H2O {}", input);
    assert.equal(execution.stdin, '"HHOHHO"\n');
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
  assert.throws(() => makePracticeExecution(problem, "Python", "", "HHOH"), /complete groups/);
});

test("Dining Philosophers runs all five participants and checks fork ownership", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "the-dining-philosophers");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][1].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["workers.emplace_back", "solution.wantsToEat", "owners[fork] != -1"]],
    ["Java", ["newFixedThreadPool(5)", "solution.wantsToEat", "owners[fork] != -1"]],
    ["Python", ["ThreadPoolExecutor(max_workers=5)", "_pool.map(_run, range(5))", "Fork ownership"]],
    ["JavaScript", ["Promise.all(Array.from({ length: 5 }", "await _solution.wantsToEat", "Fork ownership"]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class DiningPhilosophers {}", input);
    assert.equal(execution.stdin, "2\n");
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
  assert.throws(() => makePracticeExecution(problem, "Python", "", 4), /1–3 bounded meal rounds/);
});

test("read-write lock runs concurrent readers and queues a writer ahead of a later reader", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "read-write-lock-implementation");
  assert.ok(problem);
  const input = PRACTICE_TEST_PACKS[problem.id][0].rawInput;
  const expectedMarkers = new Map([
    ["C++", ["rw.lockRead()", "rw.lockWrite()", 'order[0] != "writer"']],
    ["Java", ["rw.lockRead()", "rw.lockWrite()", 'order.equals(Arrays.asList("writer", "late_reader"))']],
    ["Python", ["_lock.lock_read()", "_lock.lock_write()", '_order != ["writer", "late_reader"]']],
    ["JavaScript", ["_lock.lockRead()", "_lock.lockWrite()", "writer_precedes_late_reader: true"]],
  ]);
  for (const [language, markers] of expectedMarkers) {
    assert.ok(supportsPracticeHarness(problem, language), `${language} should be supported`);
    const execution = makePracticeExecution(problem, language as "C++" | "Java" | "Python" | "JavaScript", "class ReadWriteLock {}", input);
    assert.equal(execution.stdin, "3\n1\n");
    for (const marker of markers) assert.ok(execution.source.includes(marker), `${language} harness should include ${marker}`);
  }
  assert.throws(() => makePracticeExecution(problem, "Python", "", { readers: 1, writers: 1 }), /2–5 initial readers/);
});

test("parking lot harness validates constructor arguments", () => {
  const problem = getAllPracticeProblems().find((item) => item.id === "design-parking-lot-system");
  assert.ok(problem);
  assert.equal(supportsPracticeHarness(problem, "C++"), true);
  assert.throws(() => makePracticeExecution(problem, "C++", "", { constructorArgs: [1], carTypes: [1] }), /three initial capacities/);
});

test("LLD packs provide bounded operation scripts for all supported languages", () => {
  const ids = [
    "design-parking-lot-system",
    "design-lru-cache-with-ttl",
    "design-snake-and-ladder-game",
    "design-in-memory-file-system",
    "design-notification-service",
    "design-tic-tac-toe",
  ];
  for (const id of ids) {
    const problem = getAllPracticeProblems().find((item) => item.id === id);
    assert.ok(problem, `${id} should exist in the practice catalog`);
    const pack = PRACTICE_TEST_PACKS[id];
    assert.ok(pack?.length, `${id} should have a public test pack`);
    assert.ok(pack.length >= 2, `${id} should cover more than a single happy path`);
    for (const language of ["C++", "Java", "Python", "JavaScript"] as const) {
      assert.ok(supportsPracticeHarness(problem, language), `${id} should support ${language}`);
    const code = problem.solutionCode?.[language] ?? problem.starterCodes?.[language] ?? "";
    for (const testCase of pack) {
      const execution = makePracticeExecution(problem, language, code, testCase.rawInput);
      assert.ok(execution.stdin.length > 0, `${id} ${testCase.name} should serialize operation input for ${language}`);
    }
    }
  }
});

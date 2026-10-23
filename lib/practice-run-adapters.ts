import type { PracticeProblem } from "@/lib/practice-problems";
import type { PracticeTestCase } from "@/lib/practice-test-bundle-client";

export type PracticeLanguage = "Java" | "C++" | "Python" | "JavaScript";
type ArgumentKind = "int" | "float" | "string" | "int-array" | "float-array" | "int-matrix" | "string-array";
type ResultKind = "int" | "float" | "boolean" | "string" | "int-array" | "boolean-array" | "string-array" | "mutated-int-array";
type ObjectRunner = "parking" | "ttl-cache" | "snake-ladder" | "file-system" | "notification" | "tic-tac-toe";
type ConcurrencyRunner = "foobar" | "zero-even-odd" | "bounded-blocking-queue" | "h2o" | "dining-philosophers" | "read-write-lock";

interface ProblemAdapter {
  method: string;
  args: ArgumentKind[];
  objectKeys?: string[];
  objectRunner?: ObjectRunner;
  concurrencyRunner?: ConcurrencyRunner;
  nonNegativeArgs?: number[];
  result: ResultKind;
}

const ADAPTERS: Record<string, ProblemAdapter> = {
  "print-foobar-alternately": {
    method: "foo",
    args: ["int"],
    concurrencyRunner: "foobar",
    nonNegativeArgs: [0],
    result: "string",
  },
  "zero-even-odd": {
    method: "zero",
    args: ["int"],
    concurrencyRunner: "zero-even-odd",
    nonNegativeArgs: [0],
    result: "string",
  },
  "design-bounded-blocking-queue": {
    method: "enqueue",
    args: ["int", "int-array"],
    objectKeys: ["capacity", "items"],
    concurrencyRunner: "bounded-blocking-queue",
    result: "int-array",
  },
  "building-h2o-molecule": {
    method: "hydrogen",
    args: ["string"],
    concurrencyRunner: "h2o",
    result: "string",
  },
  "the-dining-philosophers": {
    method: "wantsToEat",
    args: ["int"],
    concurrencyRunner: "dining-philosophers",
    result: "string",
  },
  "read-write-lock-implementation": {
    method: "lockRead",
    args: ["int", "int"],
    objectKeys: ["readers", "writers"],
    concurrencyRunner: "read-write-lock",
    result: "string",
  },
  "move-zeroes": { method: "moveZeroes", args: ["int-array"], result: "mutated-int-array" },
  "majority-element": { method: "majorityElement", args: ["int-array"], result: "int" },
  "remove-duplicates-from-sorted-array": { method: "removeDuplicates", args: ["int-array"], result: "int" },
  "best-time-to-buy-and-sell-stock": { method: "maxProfit", args: ["int-array"], result: "int" },
  "rotate-array": { method: "rotate", args: ["int-array", "int"], nonNegativeArgs: [1], result: "mutated-int-array" },
  "product-of-array-except-self": { method: "productExceptSelf", args: ["int-array"], result: "int-array" },
  "valid-palindrome": { method: "isPalindrome", args: ["string"], result: "boolean" },
  "trapping-rain-water": { method: "trap", args: ["int-array"], result: "int" },
  "calculate-system-availability": {
    method: "calculateAvailability",
    args: ["float-array", "string"],
    objectKeys: ["availabilities", "type"],
    result: "float",
  },
  "solve-littles-law": {
    method: "solveLittlesLaw",
    args: ["int", "int"],
    objectKeys: ["throughput", "latencyMs"],
    result: "int",
  },
  "plan-reliability-recovery-targets": {
    method: "calculateMaxMttrMinutes",
    args: ["int", "float"],
    objectKeys: ["mtbfHours", "targetAvailability"],
    result: "int",
  },
  "calculate-amdahls-law-speedup": {
    method: "calculateSpeedup",
    args: ["float", "int"],
    objectKeys: ["p", "n"],
    result: "float",
  },
  "find-keys-reassigned-after-node-removal": {
    method: "countReassignedKeys",
    args: ["int-array", "int-array", "int"],
    objectKeys: ["nodes", "keys", "removedIndex"],
    result: "int",
  },
  "design-token-bucket-rate-limiter": {
    method: "simulateRateLimiter",
    args: ["int", "int", "int-matrix"],
    objectKeys: ["capacity", "refillRate", "requests"],
    result: "boolean-array",
  },
  "design-parking-lot-system": {
    method: "addCar", args: ["int-array", "int-array"], objectKeys: ["constructorArgs", "carTypes"], objectRunner: "parking", result: "boolean-array",
  },
  "design-lru-cache-with-ttl": {
    method: "get", args: ["int", "int-matrix"], objectKeys: ["capacity", "operations"], objectRunner: "ttl-cache", result: "int-array",
  },
  "design-snake-and-ladder-game": {
    method: "playTurn", args: ["int-matrix", "int-matrix", "int", "int"], objectKeys: ["snakes", "ladders", "currentPos", "diceRoll"], objectRunner: "snake-ladder", result: "int",
  },
  "design-in-memory-file-system": {
    method: "readContentFromFile", args: ["int-array", "string-array", "string-array"], objectKeys: ["operations", "paths", "contents"], objectRunner: "file-system", result: "string-array",
  },
  "design-notification-service": {
    method: "notify", args: ["int-array", "string-array", "string-array"], objectKeys: ["operations", "eventTypes", "values"], objectRunner: "notification", result: "string-array",
  },
  "design-tic-tac-toe": {
    method: "move", args: ["int", "int-matrix"], objectKeys: ["n", "moves"], objectRunner: "tic-tac-toe", result: "int-array",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInt32(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) &&
    value >= -2_147_483_648 && value <= 2_147_483_647;
}

function validateArgument(kind: ArgumentKind, value: unknown): boolean {
  switch (kind) {
    case "int":
      return isInt32(value);
    case "float":
      return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 1e15;
    case "string":
      return typeof value === "string" && value.length <= 8 * 1024;
    case "int-array":
      return Array.isArray(value) && value.length <= 50_000 && value.every(isInt32);
    case "float-array":
      return Array.isArray(value) && value.length <= 50_000 && value.every((part) =>
        typeof part === "number" && Number.isFinite(part) && Math.abs(part) <= 1e15,
      );
    case "int-matrix":
      return Array.isArray(value) && value.length <= 10_000 &&
        value.every((row) => Array.isArray(row) && row.length <= 10_000 && row.every(isInt32)) &&
        value.reduce((sum, row) => sum + (Array.isArray(row) ? row.length : 0), 0) <= 50_000;
    case "string-array":
      return Array.isArray(value) && value.length <= 10_000 && value.every((part) =>
        typeof part === "string" && part.length <= 8 * 1024,
      );
  }
}

function normalizeArguments(adapter: ProblemAdapter, input: unknown): unknown[] {
  let args: unknown[];
  if (adapter.objectKeys) {
    if (!isRecord(input)) throw new Error("Input must be a JSON object with the problem's named arguments.");
    args = adapter.objectKeys.map((key) => input[key]);
  } else if (adapter.args.length === 1) {
    args = [input];
  } else if (Array.isArray(input)) {
    args = input;
  } else {
    throw new Error("Input must be a JSON array of function arguments.");
  }
  if (args.length !== adapter.args.length ||
      args.some((value, index) => !validateArgument(adapter.args[index], value))) {
    throw new Error("Input does not match the bounded argument types for this problem.");
  }
  if (adapter.nonNegativeArgs?.some((index) => (args[index] as number) < 0)) {
    throw new Error("Input contains an argument that must be non-negative.");
  }
  if (adapter.concurrencyRunner && ((args[0] as number) < 1 || (args[0] as number) > 1000)) {
    throw new Error("Concurrency input n must be between 1 and 1000.");
  }
  if (adapter.concurrencyRunner === "bounded-blocking-queue" &&
      ((args[0] as number) > 20 || (args[1] as number[]).length < (args[0] as number) + 1 ||
        (args[1] as number[]).length > 100)) {
    throw new Error("Blocking queue cases require capacity 1–20 and 1–100 items, with more items than capacity.");
  }
  if (adapter.concurrencyRunner === "h2o") {
    const water = args[0] as string;
    const hydrogenCount = [...water].filter((atom) => atom === "H").length;
    if (water.length < 3 || water.length > 90 || water.length % 3 !== 0 || !/^[HO]+$/.test(water) ||
        hydrogenCount !== (water.length / 3) * 2) {
      throw new Error("H2O input must contain complete groups of two H atoms and one O atom (maximum 90 atoms).");
    }
  }
  if (adapter.concurrencyRunner === "dining-philosophers" && ((args[0] as number) < 1 || (args[0] as number) > 3)) {
    throw new Error("Dining philosophers supports 1–3 bounded meal rounds per philosopher.");
  }
  if (adapter.concurrencyRunner === "read-write-lock" &&
      ((args[0] as number) < 2 || (args[0] as number) > 5 || (args[1] as number) !== 1)) {
    throw new Error("Read-write lock fixture requires 2–5 initial readers and exactly one queued writer.");
  }
  if (adapter.objectRunner === "parking" && (args[0] as number[]).length !== 3) {
    throw new Error("Parking system requires exactly three initial capacities.");
  }
  if (adapter.objectRunner === "ttl-cache" &&
      (args[1] as number[][]).some((op) =>
        (op[0] === 0 && op.length !== 3) || (op[0] === 1 && op.length !== 5) || ![0, 1].includes(op[0]),
      )) {
    throw new Error("TTL cache operations must be get [0,key,time] or put [1,key,value,ttl,time].");
  }
  if (adapter.objectRunner === "snake-ladder" &&
      [...(args[0] as number[][]), ...(args[1] as number[][])].some((jump) => jump.length !== 2)) {
    throw new Error("Snake and ladder entries must be [start,end] pairs.");
  }
  if (adapter.objectRunner === "file-system" &&
      ((args[0] as number[]).some((op) => ![1, 2, 3, 4].includes(op)) ||
        (args[0] as number[]).length !== (args[1] as string[]).length ||
        (args[0] as number[]).length !== (args[2] as string[]).length)) {
    throw new Error("File system operations, paths, and contents must have matching lengths and valid operation codes.");
  }
  if (adapter.objectRunner === "notification" &&
      ((args[0] as number[]).some((op) => ![0, 1, 2].includes(op)) ||
        (args[0] as number[]).length !== (args[1] as string[]).length ||
        (args[0] as number[]).length !== (args[2] as string[]).length)) {
    throw new Error("Notification operations, event types, and values must have matching lengths and valid operation codes.");
  }
  if (adapter.objectRunner === "tic-tac-toe" &&
      (args[1] as number[][]).some((move) => move.length !== 3 || ![1, 2].includes(move[2]))) {
    throw new Error("Tic-tac-toe moves must be [row,column,player] triples.");
  }
  return args;
}

function pythonObjectHarness(runner: ObjectRunner, code: string): string {
  const begin = `import json, sys\nfrom typing import *\n\n${code}\n\n_args = [json.loads(line) for line in sys.stdin.read().splitlines()]\n`;
  let body: string;
  switch (runner) {
    case "parking": body = `_solution = ParkingSystem(*_args[0])\n_value = [_solution.addCar(car) for car in _args[1]]`; break;
    case "ttl-cache": body = `_solution = LRUCacheWithTTL(_args[0])\n_value = []\nfor _op in _args[1]:\n    if _op[0] == 0: _value.append(_solution.get(_op[1], _op[2]))\n    else: _solution.put(_op[1], _op[2], _op[3], _op[4])`; break;
    case "snake-ladder": body = `_solution = SnakeAndLadderGame(_args[0], _args[1])\n_value = _solution.play_turn(_args[2], _args[3])`; break;
    case "file-system": body = `_solution = FileSystem()\n_value = []\nfor _op, _path, _content in zip(*_args):\n    if _op == 1: _solution.mkdir(_path)\n    elif _op == 2: _solution.addContentToFile(_path, _content)\n    elif _op == 3: _value.append(_solution.readContentFromFile(_path))\n    elif _op == 4: _value.append(_solution.ls(_path))`; break;
    case "notification": body = `_solution = NotificationService()\n_value = []\nfor _op, _event, _value_arg in zip(*_args):\n    if _op == 0: _solution.subscribe(_event, _value_arg)\n    elif _op == 1: _solution.unsubscribe(_event, _value_arg)\n    else: _value.extend(_solution.notify(_event, _value_arg))`; break;
    case "tic-tac-toe": body = `_solution = TicTacToe(_args[0])\n_value = [_solution.move(*_move) for _move in _args[1]]`; break;
  }
  return `${begin}${body}\nprint(json.dumps(_value, separators=(",", ":"), allow_nan=False))\n`;
}

function pythonConcurrencyHarness(runner: ConcurrencyRunner, code: string): string {
  if (runner === "foobar") {
    return `import json, sys\nfrom concurrent.futures import ThreadPoolExecutor\nfrom typing import *\n\n${code}\n\n_n = json.loads(sys.stdin.readline())\n_output = []\n_solution = FooBar(_n)\nwith ThreadPoolExecutor(max_workers=2) as _pool:\n    _foo = _pool.submit(_solution.foo, lambda: _output.append("foo"))\n    _bar = _pool.submit(_solution.bar, lambda: _output.append("bar"))\n    _foo.result()\n    _bar.result()\nprint(json.dumps("".join(_output), separators=(",", ":")))\n`;
  }
  if (runner === "bounded-blocking-queue") {
    return `import json, sys, threading, time\nfrom concurrent.futures import ThreadPoolExecutor\nfrom typing import *\n\n${code}\n\n_capacity = json.loads(sys.stdin.readline())\n_items = json.loads(sys.stdin.readline())\n_queue = BoundedBlockingQueue(_capacity)\n_dequeued = []\nfor _item in _items[:_capacity]:\n    _queue.enqueue(_item)\n_started = threading.Event()\ndef _produce():\n    for _item in _items[_capacity:]:\n        _started.set()\n        _queue.enqueue(_item)\n        if _queue.size() > _capacity: raise RuntimeError("Queue exceeded its capacity")\n_producer = threading.Thread(target=_produce)\n_producer.start()\n_started.wait()\ntime.sleep(0.02)\ndef _consume():\n    for _ in _items: _dequeued.append(_queue.dequeue())\n_consumer = threading.Thread(target=_consume)\n_consumer.start()\n_producer.join()\n_consumer.join()\nif _queue.size() != 0: raise RuntimeError("Queue did not drain")\nprint(json.dumps(_dequeued, separators=(",", ":")))\n`;
  }
  if (runner === "h2o") {
    return `import json, sys, threading
from concurrent.futures import ThreadPoolExecutor
from typing import *

${code}

_water = json.loads(sys.stdin.readline())
_solution = H2O()
_output = []
_output_lock = threading.Lock()
def _release(atom):
    with _output_lock: _output.append(atom)
def _run(atom):
    if atom == "H": _solution.hydrogen(lambda: _release("H"))
    else: _solution.oxygen(lambda: _release("O"))
with ThreadPoolExecutor(max_workers=len(_water)) as _pool:
    list(_pool.map(_run, _water))
if len(_output) != len(_water): raise RuntimeError("Atom callbacks were lost")
for _index in range(0, len(_output), 3):
    _group = _output[_index:_index + 3]
    if _group.count("H") != 2 or _group.count("O") != 1: raise RuntimeError("Invalid molecule group")
print(json.dumps({"valid": True, "molecules": len(_water) // 3}, separators=(",", ":")))
`;
  }
  if (runner === "dining-philosophers") {
    return `import json, sys, threading
from concurrent.futures import ThreadPoolExecutor
from typing import *

${code}

_iterations = json.loads(sys.stdin.readline())
_solution = DiningPhilosophers()
_owners = [-1] * 5
_meals = [0] * 5
_invalid = [False]
_state_lock = threading.Lock()
def _pick(philosopher, fork):
    with _state_lock:
        if _owners[fork] != -1: _invalid[0] = True
        else: _owners[fork] = philosopher
def _put(philosopher, fork):
    with _state_lock:
        if _owners[fork] != philosopher: _invalid[0] = True
        else: _owners[fork] = -1
def _run(philosopher):
    for _ in range(_iterations):
        _solution.wantsToEat(philosopher, lambda: _pick(philosopher, philosopher), lambda: _pick(philosopher, (philosopher + 1) % 5), lambda: _eat(philosopher), lambda: _put(philosopher, philosopher), lambda: _put(philosopher, (philosopher + 1) % 5))
def _eat(philosopher):
    with _state_lock:
        if _owners[philosopher] != philosopher or _owners[(philosopher + 1) % 5] != philosopher: _invalid[0] = True
        _meals[philosopher] += 1
with ThreadPoolExecutor(max_workers=5) as _pool: list(_pool.map(_run, range(5)))
if _invalid[0] or _owners != [-1] * 5 or _meals != [_iterations] * 5: raise RuntimeError("Fork ownership or meal completion invariant failed")
print(json.dumps({"valid": True, "meals": sum(_meals)}, separators=(",", ":")))
`;
  }
  if (runner === "read-write-lock") {
    return `import json, sys, threading, time\nfrom typing import *\n\n${code}\n\n_readers = json.loads(sys.stdin.readline())\n_writers = json.loads(sys.stdin.readline())\nif _writers != 1: raise RuntimeError("Fixture requires one writer")\n_lock = ReadWriteLock()\n_state = threading.Lock()\n_active_readers = 0\n_active_writers = 0\n_max_readers = 0\n_invalid = [False]\n_order = []\n_ready = threading.Event()\n_release_initial = threading.Event()\n_late_started = threading.Event()\n_writer_started = threading.Event()\n_ready_count = [0]\ndef _read(late=False):\n    global _active_readers, _max_readers\n    if late: _late_started.set()\n    _lock.lock_read()\n    with _state:\n        if _active_writers: _invalid[0] = True\n        _active_readers += 1\n        _max_readers = max(_max_readers, _active_readers)\n        if late: _order.append("late_reader")\n        else:\n            _ready_count[0] += 1\n            if _ready_count[0] == _readers: _ready.set()\n    if not late: _release_initial.wait(2)\n    else: time.sleep(0.01)\n    with _state: _active_readers -= 1\n    _lock.unlock_read()\ndef _write():\n    global _active_writers\n    _writer_started.set()\n    _lock.lock_write()\n    with _state:\n        if _active_readers or _active_writers: _invalid[0] = True\n        _active_writers += 1\n        _order.append("writer")\n    time.sleep(0.01)\n    with _state: _active_writers -= 1\n    _lock.unlock_write()\n_initial = [threading.Thread(target=_read, daemon=True) for _ in range(_readers)]\nfor _thread in _initial: _thread.start()\nif not _ready.wait(2): raise RuntimeError("Initial readers did not acquire together")\n_writer = threading.Thread(target=_write, daemon=True); _writer.start()\nif not _writer_started.wait(2): raise RuntimeError("Writer did not start")\ntime.sleep(0.02)\n_late = threading.Thread(target=_read, args=(True,), daemon=True); _late.start()\nif not _late_started.wait(2): raise RuntimeError("Late reader did not start")\n_release_initial.set()\nfor _thread in _initial + [_writer, _late]: _thread.join(3)\nif any(_thread.is_alive() for _thread in _initial + [_writer, _late]): raise RuntimeError("Read-write lock did not drain")\nif _invalid[0] or _max_readers < 2 or _order != ["writer", "late_reader"]: raise RuntimeError("Read-write exclusion, concurrency, or writer preference invariant failed")\nprint(json.dumps({"valid": True, "max_concurrent_readers": _max_readers, "writer_precedes_late_reader": True}, separators=(",", ":")))\n`;
  }
  return `import json, sys\nfrom concurrent.futures import ThreadPoolExecutor\nfrom typing import *\n\n${code}\n\n_n = json.loads(sys.stdin.readline())\n_output = []\n_solution = ZeroEvenOdd(_n)\nwith ThreadPoolExecutor(max_workers=3) as _pool:\n    _zero = _pool.submit(_solution.zero, lambda value: _output.append(value))\n    _odd = _pool.submit(_solution.odd, lambda value: _output.append(value))\n    _even = _pool.submit(_solution.even, lambda value: _output.append(value))\n    _zero.result()\n    _odd.result()\n    _even.result()\nprint(json.dumps("".join(map(str, _output)), separators=(",", ":")))\n`;
}

function javascriptObjectHarness(runner: ObjectRunner, code: string): string {
  const begin = `${code}\n\nconst fs = require("fs");\nconst _args = fs.readFileSync(0, "utf8").split(/\\r?\\n/).filter(Boolean).map(JSON.parse);\n`;
  let body: string;
  switch (runner) {
    case "parking": body = `const _solution = new ParkingSystem(..._args[0]);\nconst _value = _args[1].map((car) => _solution.addCar(car));`; break;
    case "ttl-cache": body = `const _solution = new LRUCacheWithTTL(_args[0]);\nconst _value = [];\nfor (const _op of _args[1]) { if (_op[0] === 0) _value.push(_solution.get(_op[1], _op[2])); else _solution.put(_op[1], _op[2], _op[3], _op[4]); }`; break;
    case "snake-ladder": body = `const _solution = new SnakeAndLadderGame(_args[0], _args[1]);\nconst _value = _solution.playTurn(_args[2], _args[3]);`; break;
    case "file-system": body = `const _solution = new FileSystem();\nconst _value = [];\nfor (let i=0;i<_args[0].length;i++) { const op=_args[0][i], path=_args[1][i], content=_args[2][i]; if(op===1)_solution.mkdir(path); else if(op===2)_solution.addContentToFile(path,content); else if(op===3)_value.push(_solution.readContentFromFile(path)); else _value.push(_solution.ls(path)); }`; break;
    case "notification": body = `const _solution = new NotificationService();\nconst _value = [];\nfor (let i=0;i<_args[0].length;i++) { const op=_args[0][i], event=_args[1][i], value=_args[2][i]; if(op===0)_solution.subscribe(event,value); else if(op===1)_solution.unsubscribe(event,value); else _value.push(..._solution.notify(event,value)); }`; break;
    case "tic-tac-toe": body = `const _solution = new TicTacToe(_args[0]);\nconst _value = _args[1].map((move) => _solution.move(...move));`; break;
  }
  return `${begin}${body}\nprocess.stdout.write(JSON.stringify(_value) + "\\n");\n`;
}

function javascriptConcurrencyHarness(runner: ConcurrencyRunner, code: string): string {
  if (runner === "foobar") {
    return `${code}\n\nconst fs = require("fs");\nconst _n = JSON.parse(fs.readFileSync(0, "utf8").trim());\nconst _output = [];\nconst _solution = new FooBar(_n);\nPromise.all([\n  _solution.foo(() => _output.push("foo")),\n  _solution.bar(() => _output.push("bar")),\n]).then(() => {\n  process.stdout.write(JSON.stringify(_output.join("")) + "\\n");\n}).catch((error) => {\n  process.stderr.write(String(error));\n  process.exitCode = 1;\n});\n`;
  }
  if (runner === "bounded-blocking-queue") {
    return `${code}\n\nconst fs = require("fs");\nconst _lines = fs.readFileSync(0, "utf8").trim().split(/\\r?\\n/);\nconst _capacity = JSON.parse(_lines[0]);\nconst _items = JSON.parse(_lines[1]);\nconst _queue = new BoundedBlockingQueue(_capacity);\nconst _dequeued = [];\n(async () => {\n  for (const item of _items.slice(0, _capacity)) await _queue.enqueue(item);\n  const producer = (async () => { for (const item of _items.slice(_capacity)) await _queue.enqueue(item); })();\n  await Promise.resolve();\n  const consumer = (async () => { for (let i = 0; i < _items.length; i++) _dequeued.push(await _queue.dequeue()); })();\n  await Promise.all([producer, consumer]);\n  if (_queue.size() !== 0) throw new Error("Queue did not drain");\n  process.stdout.write(JSON.stringify(_dequeued) + "\\n");\n})().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });\n`;
  }
  if (runner === "h2o") {
    return `${code}\n\nconst fs = require("fs");\nconst _water = JSON.parse(fs.readFileSync(0, "utf8").trim());\nconst _solution = new H2O();\nconst _output = [];\nPromise.all([..._water].map((atom) => atom === "H" ? _solution.hydrogen(() => _output.push("H")) : _solution.oxygen(() => _output.push("O"))))\n  .then(() => {\n    if (_output.length !== _water.length) throw new Error("Atom callbacks were lost");\n    for (let i = 0; i < _output.length; i += 3) { const group = _output.slice(i, i + 3); if (group.filter((atom) => atom === "H").length !== 2 || group.filter((atom) => atom === "O").length !== 1) throw new Error("Invalid molecule group"); }\n    process.stdout.write(JSON.stringify({ valid: true, molecules: _water.length / 3 }) + "\\n");\n  }).catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });\n`;
  }
  if (runner === "dining-philosophers") {
    return `${code}\n\nconst fs = require("fs");\nconst _iterations = JSON.parse(fs.readFileSync(0, "utf8").trim());\nconst _solution = new DiningPhilosophers();\nconst _owners = Array(5).fill(-1);\nconst _meals = Array(5).fill(0);\nlet _invalid = false;\nfunction _pick(philosopher, fork) { if (_owners[fork] !== -1) _invalid = true; else _owners[fork] = philosopher; }\nfunction _put(philosopher, fork) { if (_owners[fork] !== philosopher) _invalid = true; else _owners[fork] = -1; }\nfunction _eat(philosopher) { if (_owners[philosopher] !== philosopher || _owners[(philosopher + 1) % 5] !== philosopher) _invalid = true; _meals[philosopher]++; }\nPromise.all(Array.from({ length: 5 }, (_, philosopher) => (async () => { for (let i = 0; i < _iterations; i++) await _solution.wantsToEat(philosopher, () => _pick(philosopher, philosopher), () => _pick(philosopher, (philosopher + 1) % 5), () => _eat(philosopher), () => _put(philosopher, philosopher), () => _put(philosopher, (philosopher + 1) % 5)); })()))\n  .then(() => { if (_invalid || _owners.some((owner) => owner !== -1) || _meals.some((meals) => meals !== _iterations)) throw new Error("Fork ownership or meal completion invariant failed"); process.stdout.write(JSON.stringify({ valid: true, meals: _meals.reduce((sum, meals) => sum + meals, 0) }) + "\\n"); })\n  .catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });\n`;
  }
  if (runner === "read-write-lock") {
    return `${code}\n\nconst fs = require("fs");\nconst _lines = fs.readFileSync(0, "utf8").trim().split(/\\r?\\n/);\nconst _readers = JSON.parse(_lines[0]);\nconst _writers = JSON.parse(_lines[1]);\nif (_writers !== 1) throw new Error("Fixture requires one writer");\nconst _lock = new ReadWriteLock();\nlet _activeReaders = 0, _activeWriters = 0, _maxReaders = 0, _invalid = false;\nconst _order = [];\nlet _readyResolve, _releaseResolve, _writerResolve;\nconst _ready = new Promise((resolve) => { _readyResolve = resolve; });\nconst _releaseInitial = new Promise((resolve) => { _releaseResolve = resolve; });\nconst _writerStarted = new Promise((resolve) => { _writerResolve = resolve; });\nlet _readyCount = 0;\nasync function _read(late = false) { const pending = _lock.lockRead(); if (late) _order.push("late_requested"); await pending; if (_activeWriters) _invalid = true; _activeReaders++; _maxReaders = Math.max(_maxReaders, _activeReaders); if (late) _order.push("late_reader"); else if (++_readyCount === _readers) _readyResolve(); if (!late) await _releaseInitial; else await new Promise((resolve) => setTimeout(resolve, 10)); _activeReaders--; _lock.unlockRead(); }\nasync function _write() { const pending = _lock.lockWrite(); _writerResolve(); await pending; if (_activeReaders || _activeWriters) _invalid = true; _activeWriters++; _order.push("writer"); await new Promise((resolve) => setTimeout(resolve, 10)); _activeWriters--; _lock.unlockWrite(); }\n(async () => { const initial = Array.from({ length: _readers }, () => _read()); await _ready; const writer = _write(); await _writerStarted; await Promise.resolve(); const late = _read(true); await Promise.resolve(); _releaseResolve(); await Promise.all([...initial, writer, late]); if (_invalid || _maxReaders < 2 || _order.indexOf("writer") < 0 || _order.indexOf("writer") > _order.indexOf("late_reader")) throw new Error("Read-write exclusion, concurrency, or writer preference invariant failed"); process.stdout.write(JSON.stringify({ valid: true, max_concurrent_readers: _maxReaders, writer_precedes_late_reader: true }) + "\\n"); })().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });\n`;
  }
  return `${code}\n\nconst fs = require("fs");\nconst _n = JSON.parse(fs.readFileSync(0, "utf8").trim());\nconst _output = [];\nconst _solution = new ZeroEvenOdd(_n);\nPromise.all([\n  _solution.zero((value) => _output.push(value)),\n  _solution.odd((value) => _output.push(value)),\n  _solution.even((value) => _output.push(value)),\n]).then(() => {\n  process.stdout.write(JSON.stringify(_output.join("")) + "\\n");\n}).catch((error) => {\n  process.stderr.write(String(error));\n  process.exitCode = 1;\n});\n`;
}

function cppConcurrencyHarness(runner: ConcurrencyRunner, code: string): string {
  if (runner === "foobar") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  int n; if (!(cin >> n)) return 2;\n  FooBar solution(n);\n  string output;\n  mutex output_mutex;\n  thread foo_thread([&] { solution.foo([&] { lock_guard<mutex> lock(output_mutex); output += "foo"; }); });\n  thread bar_thread([&] { solution.bar([&] { lock_guard<mutex> lock(output_mutex); output += "bar"; }); });\n  foo_thread.join();\n  bar_thread.join();\n  cout << output << '\\n';\n}\n`;
  }
  if (runner === "bounded-blocking-queue") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  int capacity; if (!(cin >> capacity)) return 2;\n  string raw_items; getline(cin, raw_items); getline(cin, raw_items);\n  vector<int> items; regex item_pattern("-?[0-9]+"); for (sregex_iterator it(raw_items.begin(), raw_items.end(), item_pattern), end; it != end; ++it) items.push_back(stoi(it->str()));\n  BoundedBlockingQueue queue(capacity);\n  vector<int> output;\n  for (int i = 0; i < capacity; ++i) queue.enqueue(items.at(i));\n  mutex started_mutex; condition_variable started_cv; bool started = false;\n  thread producer([&] { for (size_t i = capacity; i < items.size(); ++i) { { lock_guard<mutex> lock(started_mutex); started = true; } started_cv.notify_one(); queue.enqueue(items[i]); if (queue.size() > capacity) abort(); } });\n  { unique_lock<mutex> lock(started_mutex); started_cv.wait(lock, [&] { return started; }); }\n  this_thread::sleep_for(chrono::milliseconds(20));\n  thread consumer([&] { for (size_t i = 0; i < items.size(); ++i) output.push_back(queue.dequeue()); });\n  producer.join(); consumer.join();\n  if (queue.size() != 0 || output.size() != items.size()) return 3;\n  cout << '['; for (size_t i = 0; i < output.size(); ++i) { if (i) cout << ','; cout << output[i]; } cout << "]\\n";\n}\n`;
  }
  if (runner === "h2o") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  string water; if (!(cin >> water)) return 2;\n  if (water.size() >= 2 && water.front() == '\\"') water = water.substr(1, water.size() - 2);\n  H2O solution; string output; mutex output_mutex; vector<thread> workers;\n  for (char atom : water) workers.emplace_back([&, atom] { auto release = [&] { lock_guard<mutex> lock(output_mutex); output.push_back(atom); }; if (atom == 'H') solution.hydrogen(release); else solution.oxygen(release); });\n  for (auto& worker : workers) worker.join();\n  if (output.size() != water.size()) return 3;\n  for (size_t i = 0; i < output.size(); i += 3) { string group = output.substr(i, 3); if (count(group.begin(), group.end(), 'H') != 2 || count(group.begin(), group.end(), 'O') != 1) return 4; }\n  cout << char(123) << char(34) << "valid" << char(34) << ":true," << char(34) << "molecules" << char(34) << ":" << water.size() / 3 << "}" << '\\n';\n}\n`;
  }
  if (runner === "dining-philosophers") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  int iterations; if (!(cin >> iterations)) return 2;\n  DiningPhilosophers solution; array<int,5> owners; owners.fill(-1); array<int,5> meals{}; bool invalid = false; mutex state_mutex; vector<thread> workers;\n  for (int philosopher = 0; philosopher < 5; ++philosopher) workers.emplace_back([&, philosopher] { for (int round = 0; round < iterations; ++round) { auto pick_left = [&] { lock_guard<mutex> lock(state_mutex); if (owners[philosopher] != -1) invalid = true; else owners[philosopher] = philosopher; }; auto pick_right = [&] { int fork = (philosopher + 1) % 5; lock_guard<mutex> lock(state_mutex); if (owners[fork] != -1) invalid = true; else owners[fork] = philosopher; }; auto eat = [&] { lock_guard<mutex> lock(state_mutex); if (owners[philosopher] != philosopher || owners[(philosopher + 1) % 5] != philosopher) invalid = true; meals[philosopher]++; }; auto put_left = [&] { lock_guard<mutex> lock(state_mutex); if (owners[philosopher] != philosopher) invalid = true; else owners[philosopher] = -1; }; auto put_right = [&] { int fork = (philosopher + 1) % 5; lock_guard<mutex> lock(state_mutex); if (owners[fork] != philosopher) invalid = true; else owners[fork] = -1; }; solution.wantsToEat(philosopher, pick_left, pick_right, eat, put_left, put_right); } });\n  for (auto& worker : workers) worker.join();\n  if (invalid || any_of(owners.begin(), owners.end(), [](int owner) { return owner != -1; }) || any_of(meals.begin(), meals.end(), [iterations](int count) { return count != iterations; })) return 3;\n  cout << char(123) << char(34) << "valid" << char(34) << ":true," << char(34) << "meals" << char(34) << ":" << iterations * 5 << "}" << '\\n';\n}\n`;
  }
  if (runner === "read-write-lock") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  int readers, writers; if (!(cin >> readers >> writers) || writers != 1) return 2;\n  ReadWriteLock rw; mutex state_mutex, gate_mutex; condition_variable gate_cv; int ready = 0, active_readers = 0, active_writers = 0, max_readers = 0; bool release_initial = false, writer_started = false, invalid = false; vector<string> order;\n  auto reader = [&](bool late) { rw.lockRead(); { unique_lock<mutex> state(state_mutex); if (active_writers) invalid = true; active_readers++; max_readers = max(max_readers, active_readers); if (late) order.push_back("late_reader"); else { ready++; gate_cv.notify_all(); } } if (!late) { unique_lock<mutex> gate(gate_mutex); gate_cv.wait(gate, [&] { return release_initial; }); } else this_thread::sleep_for(chrono::milliseconds(10)); { lock_guard<mutex> state(state_mutex); active_readers--; } rw.unlockRead(); };\n  vector<thread> initial; for (int i = 0; i < readers; ++i) initial.emplace_back(reader, false);\n  { unique_lock<mutex> gate(gate_mutex); gate_cv.wait(gate, [&] { return ready == readers; }); }\n  thread writer([&] { { lock_guard<mutex> gate(gate_mutex); writer_started = true; } gate_cv.notify_all(); rw.lockWrite(); { lock_guard<mutex> state(state_mutex); if (active_readers || active_writers) invalid = true; active_writers++; order.push_back("writer"); } this_thread::sleep_for(chrono::milliseconds(10)); { lock_guard<mutex> state(state_mutex); active_writers--; } rw.unlockWrite(); });\n  { unique_lock<mutex> gate(gate_mutex); gate_cv.wait(gate, [&] { return writer_started; }); } this_thread::sleep_for(chrono::milliseconds(20));\n  thread late(reader, true);\n  { lock_guard<mutex> gate(gate_mutex); release_initial = true; } gate_cv.notify_all();\n  for (auto& worker : initial) worker.join(); writer.join(); late.join();\n  if (invalid || max_readers < 2 || order.size() != 2 || order[0] != "writer" || order[1] != "late_reader") return 3;\n  cout << char(123) << char(34) << "valid" << char(34) << ":true," << char(34) << "max_concurrent_readers" << char(34) << ":" << max_readers << "," << char(34) << "writer_precedes_late_reader" << char(34) << ":true}" << '\\n';\n}\n`;
  }
  return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nint main() {\n  int n; if (!(cin >> n)) return 2;\n  ZeroEvenOdd solution(n);\n  vector<int> output;\n  mutex output_mutex;\n  auto append = [&](int value) { lock_guard<mutex> lock(output_mutex); output.push_back(value); };\n  thread zero_thread([&] { solution.zero(append); });\n  thread odd_thread([&] { solution.odd(append); });\n  thread even_thread([&] { solution.even(append); });\n  zero_thread.join();\n  odd_thread.join();\n  even_thread.join();\n  for (int value : output) cout << value;\n  cout << '\\n';\n}\n`;
}

function javaConcurrencyHarness(runner: ConcurrencyRunner, code: string): string {
  if (runner === "foobar") {
    return `import java.io.*;\nimport java.util.concurrent.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());\n    FooBar solution = new FooBar(n);\n    StringBuilder output = new StringBuilder();\n    Object outputLock = new Object();\n    ExecutorService pool = Executors.newFixedThreadPool(2);\n    Future<?> foo = pool.submit(() -> { try { solution.foo(() -> { synchronized (outputLock) { output.append("foo"); } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    Future<?> bar = pool.submit(() -> { try { solution.bar(() -> { synchronized (outputLock) { output.append("bar"); } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    foo.get(); bar.get(); pool.shutdown();\n    System.out.println(output);\n  }\n}\n`;
  }
  if (runner === "bounded-blocking-queue") {
    return `import java.io.*;\nimport java.util.*;\nimport java.util.concurrent.*;\nimport java.util.regex.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n    int capacity = Integer.parseInt(reader.readLine().trim());\n    String itemsLine = reader.readLine();\n    Matcher matcher = Pattern.compile("-?\\\\d+").matcher(itemsLine);\n    List<Integer> items = new ArrayList<>(); while (matcher.find()) items.add(Integer.parseInt(matcher.group()));\n    BoundedBlockingQueue queue = new BoundedBlockingQueue(capacity);\n    List<Integer> output = Collections.synchronizedList(new ArrayList<>());\n    for (int i = 0; i < capacity; i++) queue.enqueue(items.get(i));\n    CountDownLatch started = new CountDownLatch(1);\n    Thread producer = new Thread(() -> { try { for (int i = capacity; i < items.size(); i++) { started.countDown(); queue.enqueue(items.get(i)); if (queue.size() > capacity) throw new AssertionError("Queue exceeded capacity"); } } catch (Exception e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    producer.start(); started.await(); Thread.sleep(20);\n    Thread consumer = new Thread(() -> { try { for (int i = 0; i < items.size(); i++) output.add(queue.dequeue()); } catch (Exception e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    consumer.start(); producer.join(); consumer.join();\n    if (queue.size() != 0 || output.size() != items.size()) throw new AssertionError("Queue did not drain");\n    System.out.println(output);\n  }\n}\n`;
  }
  if (runner === "h2o") {
    return `import java.io.*;\nimport java.util.*;\nimport java.util.concurrent.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    String water = new BufferedReader(new InputStreamReader(System.in)).readLine().trim();\n    water = water.substring(1, water.length() - 1);\n    H2O solution = new H2O(); StringBuffer output = new StringBuffer();\n    ExecutorService pool = Executors.newFixedThreadPool(water.length()); List<Future<?>> tasks = new ArrayList<>();\n    for (char atom : water.toCharArray()) { final char current = atom; tasks.add(pool.submit(() -> { try { if (current == 'H') solution.hydrogen(() -> output.append('H')); else solution.oxygen(() -> output.append('O')); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } })); }\n    for (Future<?> task : tasks) task.get(); pool.shutdown();\n    String result = output.toString(); if (result.length() != water.length()) throw new AssertionError("Atom callbacks were lost");\n    for (int i = 0; i < result.length(); i += 3) { String group = result.substring(i, i + 3); long h = group.chars().filter(c -> c == 'H').count(); long o = group.chars().filter(c -> c == 'O').count(); if (h != 2 || o != 1) throw new AssertionError("Invalid molecule group"); }\n    System.out.printf("{%cvalid%c:true,%cmolecules%c:%d}%n", 34, 34, 34, 34, water.length() / 3);\n  }\n}\n`;
  }
  if (runner === "dining-philosophers") {
    return `import java.io.*;\nimport java.util.*;\nimport java.util.concurrent.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    int iterations = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());\n    DiningPhilosophers solution = new DiningPhilosophers(); int[] owners = {-1,-1,-1,-1,-1}; int[] meals = new int[5]; boolean[] invalid = {false}; Object stateLock = new Object();\n    ExecutorService pool = Executors.newFixedThreadPool(5); List<Future<?>> tasks = new ArrayList<>();\n    for (int p = 0; p < 5; p++) { final int philosopher = p; tasks.add(pool.submit(() -> { for (int round = 0; round < iterations; round++) { try { solution.wantsToEat(philosopher, () -> { synchronized(stateLock) { if (owners[philosopher] != -1) invalid[0] = true; else owners[philosopher] = philosopher; } }, () -> { int fork = (philosopher + 1) % 5; synchronized(stateLock) { if (owners[fork] != -1) invalid[0] = true; else owners[fork] = philosopher; } }, () -> { synchronized(stateLock) { if (owners[philosopher] != philosopher || owners[(philosopher + 1) % 5] != philosopher) invalid[0] = true; meals[philosopher]++; } }, () -> { synchronized(stateLock) { if (owners[philosopher] != philosopher) invalid[0] = true; else owners[philosopher] = -1; } }, () -> { int fork = (philosopher + 1) % 5; synchronized(stateLock) { if (owners[fork] != philosopher) invalid[0] = true; else owners[fork] = -1; } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } } })); }\n    for (Future<?> task : tasks) task.get(); pool.shutdown();\n    for (int p = 0; p < 5; p++) if (owners[p] != -1 || meals[p] != iterations) invalid[0] = true;\n    if (invalid[0]) throw new AssertionError("Fork ownership or meal completion invariant failed");\n    System.out.printf("{%cvalid%c:true,%cmeals%c:%d}\\n", 34, 34, 34, 34, iterations * 5);\n  }\n}\n`;
  }
  if (runner === "read-write-lock") {
    return `import java.io.*;\nimport java.util.*;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    String[] values = new BufferedReader(new InputStreamReader(System.in)).readLine().trim().split("\\s+"); int readers = Integer.parseInt(values[0]);\n    ReadWriteLock rw = new ReadWriteLock(); Object state = new Object(); CountDownLatch ready = new CountDownLatch(readers), releaseInitial = new CountDownLatch(1), writerStarted = new CountDownLatch(1); AtomicInteger activeReaders = new AtomicInteger(), activeWriters = new AtomicInteger(), maxReaders = new AtomicInteger(); AtomicBoolean invalid = new AtomicBoolean(false); List<String> order = Collections.synchronizedList(new ArrayList<>()); ExecutorService pool = Executors.newFixedThreadPool(readers + 2); List<Future<?>> tasks = new ArrayList<>();\n    for (int i = 0; i < readers; i++) tasks.add(pool.submit(() -> { try { rw.lockRead(); if (activeWriters.get() != 0) invalid.set(true); int now = activeReaders.incrementAndGet(); maxReaders.accumulateAndGet(now, Math::max); ready.countDown(); releaseInitial.await(); activeReaders.decrementAndGet(); rw.unlockRead(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } }));\n    ready.await(2, TimeUnit.SECONDS);\n    Future<?> writer = pool.submit(() -> { try { writerStarted.countDown(); rw.lockWrite(); if (activeReaders.get() != 0 || activeWriters.get() != 0) invalid.set(true); activeWriters.incrementAndGet(); order.add("writer"); Thread.sleep(10); activeWriters.decrementAndGet(); rw.unlockWrite(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    writerStarted.await(); Thread.sleep(20);\n    Future<?> late = pool.submit(() -> { try { rw.lockRead(); if (activeWriters.get() != 0) invalid.set(true); activeReaders.incrementAndGet(); order.add("late_reader"); Thread.sleep(10); activeReaders.decrementAndGet(); rw.unlockRead(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    releaseInitial.countDown(); for (Future<?> task : tasks) task.get(2, TimeUnit.SECONDS); writer.get(2, TimeUnit.SECONDS); late.get(2, TimeUnit.SECONDS); pool.shutdown();\n    if (invalid.get() || maxReaders.get() < 2 || !order.equals(Arrays.asList("writer", "late_reader"))) throw new AssertionError("Read-write exclusion, concurrency, or writer preference invariant failed");\n    System.out.printf("{%cvalid%c:true,%cmax_concurrent_readers%c:%d,%cwriter_precedes_late_reader%c:true}\\n", 34, 34, 34, 34, maxReaders.get(), 34, 34);\n  }\n}\n`;
  }
  return `import java.io.*;\nimport java.util.concurrent.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());\n    ZeroEvenOdd solution = new ZeroEvenOdd(n);\n    StringBuilder output = new StringBuilder();\n    Object outputLock = new Object();\n    ExecutorService pool = Executors.newFixedThreadPool(3);\n    Future<?> zero = pool.submit(() -> { try { solution.zero(value -> { synchronized (outputLock) { output.append(value); } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    Future<?> odd = pool.submit(() -> { try { solution.odd(value -> { synchronized (outputLock) { output.append(value); } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    Future<?> even = pool.submit(() -> { try { solution.even(value -> { synchronized (outputLock) { output.append(value); } }); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); } });\n    zero.get(); odd.get(); even.get(); pool.shutdown();\n    System.out.println(output);\n  }\n}\n`;
}

function pythonHarness(adapter: ProblemAdapter, code: string): string {
  if (adapter.concurrencyRunner) return pythonConcurrencyHarness(adapter.concurrencyRunner, code);
  if (adapter.objectRunner) return pythonObjectHarness(adapter.objectRunner, code);
  const getResult = adapter.result === "mutated-int-array"
    ? `method(*args)\nvalue = args[0]`
    : `value = method(*args)`;
  return `import json, sys\nfrom typing import *\n\n${code}\n\n_payload = [json.loads(line) for line in sys.stdin.read().splitlines()]\n_solution = Solution()\nmethod = getattr(_solution, ${JSON.stringify(adapter.method)})\nargs = _payload\n${getResult}\nprint(json.dumps(value, separators=(",", ":"), allow_nan=False))\n`;
}

function javascriptHarness(adapter: ProblemAdapter, code: string): string {
  if (adapter.concurrencyRunner) return javascriptConcurrencyHarness(adapter.concurrencyRunner, code);
  if (adapter.objectRunner) return javascriptObjectHarness(adapter.objectRunner, code);
  const getResult = adapter.result === "mutated-int-array"
    ? ` ${adapter.method}(...args); const value = args[0];`
    : `const value = ${adapter.method}(...args);`;
  return `${code}\n\nconst fs = require("fs");\nconst args = fs.readFileSync(0, "utf8").split(/\\r?\\n/).filter(Boolean).map(JSON.parse);\n${getResult}\nprocess.stdout.write(JSON.stringify(value) + "\\n");\n`;
}

function cppArgumentDeclaration(kind: ArgumentKind, index: number): string {
  const raw = `raw${index}`;
  const arg = `arg${index}`;
  const read = `string ${raw}; getline(cin, ${raw});`;
  switch (kind) {
    case "int": return `${read} int ${arg} = stoi(${raw});`;
    case "float": return `${read} double ${arg} = stod(${raw});`;
    case "string": return `${read} string ${arg} = unquoteJson(${raw});`;
    case "int-array": return `${read} vector<int> ${arg} = parseIntArray(${raw});`;
    case "float-array": return `${read} vector<double> ${arg} = parseDoubleArray(${raw});`;
    case "int-matrix": return `${read} vector<vector<int>> ${arg} = parseIntMatrix(${raw});`;
    case "string-array": return `${read} vector<string> ${arg} = parseStringArray(${raw});`;
  }
}

function cppHarness(adapter: ProblemAdapter, code: string): string {
  if (adapter.concurrencyRunner) return cppConcurrencyHarness(adapter.concurrencyRunner, code);
  if (adapter.objectRunner) return cppObjectHarness(adapter.objectRunner, adapter, code);
  const declarations = adapter.args.map(cppArgumentDeclaration).join("\n  ");
  const call = `solution.${adapter.method}(${adapter.args.map((_, index) => `arg${index}`).join(", ")})`;
  const output = adapter.result === "mutated-int-array"
    ? `${call}; printJson(arg0);`
    : `printJson(${call});`;
  return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nstatic string unquoteJson(const string& raw) { string out; for(size_t i=1;i+1<raw.size();++i){ unsigned char c=raw[i]; if(c==92 && i+2<raw.size()){ char e=raw[++i]; if(e=='n') out.push_back(10); else if(e=='r') out.push_back(13); else if(e=='t') out.push_back(9); else if(e=='b') out.push_back(8); else if(e=='f') out.push_back(12); else out.push_back(e); } else out.push_back(c); } return out; }\nstatic vector<int> parseIntArray(const string& raw) { regex pattern("-?[0-9]+"); vector<int> values; for(sregex_iterator it(raw.begin(),raw.end(),pattern), end; it!=end; ++it) values.push_back(stoi(it->str())); return values; }\nstatic vector<double> parseDoubleArray(const string& raw) { regex pattern("-?[0-9]+(\\\\.[0-9]+)?([eE][+-]?[0-9]+)?"); vector<double> values; for(sregex_iterator it(raw.begin(),raw.end(),pattern), end; it!=end; ++it) values.push_back(stod(it->str())); return values; }\nstatic vector<vector<int>> parseIntMatrix(const string& raw) { if(raw == "[]") return {}; regex rowPattern(R"(\\[[^\\[\\]]*\\])"); vector<vector<int>> rows; for(sregex_iterator it(raw.begin(),raw.end(),rowPattern), end; it!=end; ++it) rows.push_back(parseIntArray(it->str())); return rows; }\nstatic void printJson(const vector<int>& v) { cout << "["; for(size_t i=0;i<v.size();++i){ if(i) cout << ","; cout << v[i]; } cout << "]\\n"; }\nstatic void printJson(const vector<double>& v) { cout << "["; for(size_t i=0;i<v.size();++i){ if(i) cout << ","; cout << setprecision(15) << v[i]; } cout << "]\\n"; }\nstatic void printJson(const vector<bool>& v) { cout << "["; for(size_t i=0;i<v.size();++i){ if(i) cout << ","; cout << (v[i] ? "true" : "false"); } cout << "]\\n"; }\nstatic void printJson(int v) { cout << v << "\\n"; }\nstatic void printJson(double v) { cout << setprecision(15) << v << "\\n"; }\nstatic void printJson(bool v) { cout << (v ? "true" : "false") << "\\n"; }\nint main() {\n  ${declarations}\n  Solution solution;\n  ${output}\n}\n`;
}

function cppObjectHarness(runner: ObjectRunner, adapter: ProblemAdapter, code: string): string {
  const declarations = adapter.args.map(cppArgumentDeclaration).join("\n  ");
  let body: string;
  switch (runner) {
    case "parking": body = `ParkingSystem solution(arg0[0], arg0[1], arg0[2]);\n  vector<bool> value; for (int car : arg1) value.push_back(solution.addCar(car)); printJson(value);`; break;
    case "ttl-cache": body = `LRUCacheWithTTL solution(arg0);\n  vector<int> value; for (const auto& op : arg1) { if (op[0] == 0) value.push_back(solution.get(op[1], op[2])); else solution.put(op[1], op[2], op[3], op[4]); } printJson(value);`; break;
    case "snake-ladder": body = `SnakeAndLadderGame solution(arg0, arg1);\n  printJson(solution.playTurn(arg2, arg3));`; break;
    case "file-system": body = `FileSystem solution;\n  vector<string> values; for (size_t i=0;i<arg0.size();++i) { if(arg0[i]==1) solution.mkdir(arg1[i]); else if(arg0[i]==2) solution.addContentToFile(arg1[i],arg2[i]); else if(arg0[i]==3) values.push_back(jsonQuote(solution.readContentFromFile(arg1[i]))); else { auto listed=solution.ls(arg1[i]); values.push_back(joinJson(listed)); } } printRawJsonArray(values);`; break;
    case "notification": body = `NotificationService solution;\n  vector<string> values; for (size_t i=0;i<arg0.size();++i) { if(arg0[i]==0) solution.subscribe(arg1[i],arg2[i]); else if(arg0[i]==1) solution.unsubscribe(arg1[i],arg2[i]); else { auto notified=solution.notify(arg1[i],arg2[i]); values.insert(values.end(),notified.begin(),notified.end()); } } printJson(values);`; break;
    case "tic-tac-toe": body = `TicTacToe solution(arg0);\n  vector<int> value; for(const auto& move : arg1) value.push_back(solution.move(move[0],move[1],move[2])); printJson(value);`; break;
  }
  return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\n\nstatic string unquoteJson(const string& raw) { string out; for(size_t i=1;i+1<raw.size();++i){ unsigned char c=raw[i]; if(c==92 && i+2<raw.size()){ char e=raw[++i]; if(e=='n') out.push_back(10); else if(e=='r') out.push_back(13); else if(e=='t') out.push_back(9); else if(e=='b') out.push_back(8); else if(e=='f') out.push_back(12); else out.push_back(e); } else out.push_back(c); } return out; }\nstatic vector<int> parseIntArray(const string& raw) { regex pattern("-?[0-9]+"); vector<int> values; for(sregex_iterator it(raw.begin(),raw.end(),pattern), end;it!=end;++it) values.push_back(stoi(it->str())); return values; }\nstatic vector<vector<int>> parseIntMatrix(const string& raw) { if(raw == "[]") return {}; regex rowPattern(R"(\\[[^\\[\\]]*\\])"); vector<vector<int>> rows; for(sregex_iterator it(raw.begin(),raw.end(),rowPattern),end;it!=end;++it) rows.push_back(parseIntArray(it->str())); return rows; }\nstatic vector<string> parseStringArray(const string& raw) { regex pattern(R"(\"(?:\\\\.|[^\"\\\\])*\")"); vector<string> values; for(sregex_iterator it(raw.begin(),raw.end(),pattern),end;it!=end;++it) values.push_back(unquoteJson(it->str())); return values; }\nstatic string jsonQuote(const string& value) { string out="\\\""; for(unsigned char c:value){ if(c=='\\\"'||c==92){out.push_back(92);out.push_back((char)c);} else if(c==10) out += "\\\\n"; else if(c==13) out += "\\\\r"; else if(c==9) out += "\\\\t"; else out.push_back((char)c); } out.push_back('\\\"'); return out; }\nstatic string joinJson(const vector<string>& values) { string out="["; for(size_t i=0;i<values.size();++i){if(i)out+=",";out+=jsonQuote(values[i]);} return out+"]"; }\nstatic void printRawJsonArray(const vector<string>& values) { cout << "["; for(size_t i=0;i<values.size();++i){if(i)cout<<",";cout<<values[i];} cout<<"]\\n"; }\nstatic void printJson(const vector<bool>& v) { cout << "["; for(size_t i=0;i<v.size();++i){if(i)cout<<",";cout<<(v[i]?"true":"false");} cout<<"]\\n"; }\nstatic void printJson(const vector<int>& v) { cout << "["; for(size_t i=0;i<v.size();++i){if(i)cout<<",";cout<<v[i];} cout<<"]\\n"; }\nstatic void printJson(const vector<string>& v) { cout << joinJson(v) << "\\n"; }\nstatic void printJson(int v) { cout << v << "\\n"; }\nint main() {\n  ${declarations}\n  ${body}\n}\n`;
}

function javaArgumentDeclaration(kind: ArgumentKind, index: number): string {
  const raw = `raw${index}`;
  const arg = `arg${index}`;
  switch (kind) {
    case "int": return `int ${arg} = Integer.parseInt(${raw}.trim());`;
    case "float": return `double ${arg} = Double.parseDouble(${raw}.trim());`;
    case "string": return `String ${arg} = unquote(${raw});`;
    case "int-array": return `int[] ${arg} = intArray(${raw});`;
    case "float-array": return `double[] ${arg} = doubleArray(${raw});`;
    case "int-matrix": return `int[][] ${arg} = intMatrix(${raw});`;
    case "string-array": return `String[] ${arg} = stringArray(${raw});`;
  }
}

function javaHarness(adapter: ProblemAdapter, code: string): string {
  if (adapter.concurrencyRunner) return javaConcurrencyHarness(adapter.concurrencyRunner, code);
  if (adapter.objectRunner) return javaObjectHarness(adapter.objectRunner, adapter, code);
  const declarations = adapter.args.map(javaArgumentDeclaration).join("\n    ");
  const call = `solution.${adapter.method}(${adapter.args.map((_, index) => `arg${index}`).join(", ")})`;
  const result = adapter.result === "mutated-int-array"
    ? `${call}; Object value = arg0;`
    : `Object value = ${call};`;
  return `import java.io.*;\nimport java.lang.reflect.Array;\nimport java.util.*;\nimport java.util.regex.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    String input = new String(System.in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);\n    String[] raw = input.split("\\\\R", -1);\n    ${adapter.args.map((_, index) => `String raw${index} = raw.length > ${index} ? raw[${index}] : "";`).join("\n    ")}\n    ${declarations}\n    Solution solution = new Solution();\n    ${result}\n    System.out.println(json(value));\n  }\n  static String unquote(String raw) { String s=raw.trim(); StringBuilder b=new StringBuilder(); for(int i=1;i<s.length()-1;i++){ char c=s.charAt(i); if(c==92 && i+1<s.length()-1){ char e=s.charAt(++i); if(e=='n') b.append((char)10); else if(e=='r') b.append((char)13); else if(e=='t') b.append((char)9); else if(e=='b') b.append((char)8); else if(e=='f') b.append((char)12); else b.append(e); } else b.append(c); } return b.toString(); }\n  static int[] intArray(String s) { Matcher m=Pattern.compile("-?\\\\d+").matcher(s); List<Integer> a=new ArrayList<>(); while(m.find()) a.add(Integer.parseInt(m.group())); return a.stream().mapToInt(Integer::intValue).toArray(); }\n  static double[] doubleArray(String s) { Matcher m=Pattern.compile("-?[0-9]+(?:\\\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?").matcher(s); List<Double> a=new ArrayList<>(); while(m.find()) a.add(Double.parseDouble(m.group())); return a.stream().mapToDouble(Double::doubleValue).toArray(); }\n  static int[][] intMatrix(String s) { if (s.trim().equals("[]")) return new int[0][]; Matcher m=Pattern.compile("\\\\[[^\\\\[\\\\]]*\\\\]").matcher(s); List<int[]> rows=new ArrayList<>(); while(m.find()) rows.add(intArray(m.group())); return rows.toArray(new int[0][]); }\n  static String json(Object v) { if(v==null) return "null"; if(v instanceof Boolean || v instanceof Number) return v.toString(); if(v.getClass().isArray()){ StringJoiner j=new StringJoiner(",","[","]"); for(int i=0;i<Array.getLength(v);i++) j.add(json(Array.get(v,i))); return j.toString(); } throw new IllegalArgumentException("Unsupported result"); }\n}\n`;
}

function javaObjectHarness(runner: ObjectRunner, adapter: ProblemAdapter, code: string): string {
  const declarations = adapter.args.map(javaArgumentDeclaration).join("\n    ");
  let body: string;
  switch (runner) {
    case "parking": body = `ParkingSystem solution = new ParkingSystem(arg0[0], arg0[1], arg0[2]);\n    boolean[] value = new boolean[arg1.length]; for(int i=0;i<arg1.length;i++) value[i]=solution.addCar(arg1[i]);`; break;
    case "ttl-cache": body = `LRUCacheWithTTL solution = new LRUCacheWithTTL(arg0);\n    List<Integer> value = new ArrayList<>(); for(int[] op:arg1) { if(op[0]==0) value.add(solution.get(op[1],op[2])); else solution.put(op[1],op[2],op[3],op[4]); }`; break;
    case "snake-ladder": body = `SnakeAndLadderGame solution = new SnakeAndLadderGame(arg0,arg1);\n    int value = solution.playTurn(arg2,arg3);`; break;
    case "file-system": body = `FileSystem solution = new FileSystem();\n    List<Object> value = new ArrayList<>(); for(int i=0;i<arg0.length;i++) { if(arg0[i]==1) solution.mkdir(arg1[i]); else if(arg0[i]==2) solution.addContentToFile(arg1[i],arg2[i]); else if(arg0[i]==3) value.add(solution.readContentFromFile(arg1[i])); else value.add(solution.ls(arg1[i])); }`; break;
    case "notification": body = `NotificationService solution = new NotificationService();\n    List<String> value = new ArrayList<>(); for(int i=0;i<arg0.length;i++) { if(arg0[i]==0) solution.subscribe(arg1[i],arg2[i]); else if(arg0[i]==1) solution.unsubscribe(arg1[i],arg2[i]); else value.addAll(solution.notify(arg1[i],arg2[i])); }`; break;
    case "tic-tac-toe": body = `TicTacToe solution = new TicTacToe(arg0);\n    int[] value = new int[arg1.length]; for(int i=0;i<arg1.length;i++) value[i]=solution.move(arg1[i][0],arg1[i][1],arg1[i][2]);`; break;
  }
  return `import java.io.*;\nimport java.lang.reflect.Array;\nimport java.util.*;\nimport java.util.regex.*;\n${code}\n\npublic class Main {\n  public static void main(String[] ignored) throws Exception {\n    String input = new String(System.in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);\n    String[] raw = input.split("\\\\R", -1);\n    ${adapter.args.map((_, index) => `String raw${index} = raw.length > ${index} ? raw[${index}] : "";`).join("\n    ")}\n    ${declarations}\n    ${body}\n    System.out.println(json(value));\n  }\n  static String unquote(String raw) { String s=raw.trim(); StringBuilder b=new StringBuilder(); for(int i=1;i<s.length()-1;i++){ char c=s.charAt(i); if(c==92 && i+1<s.length()-1){ char e=s.charAt(++i); if(e=='n') b.append((char)10); else if(e=='r') b.append((char)13); else if(e=='t') b.append((char)9); else if(e=='b') b.append((char)8); else if(e=='f') b.append((char)12); else b.append(e); } else b.append(c); } return b.toString(); }\n  static int[] intArray(String s) { Matcher m=Pattern.compile("-?\\\\d+").matcher(s); List<Integer> a=new ArrayList<>(); while(m.find()) a.add(Integer.parseInt(m.group())); return a.stream().mapToInt(Integer::intValue).toArray(); }\n  static int[][] intMatrix(String s) { if (s.trim().equals("[]")) return new int[0][]; Matcher m=Pattern.compile("\\\\[[^\\\\[\\\\]]*\\\\]").matcher(s); List<int[]> rows=new ArrayList<>(); while(m.find()) rows.add(intArray(m.group())); return rows.toArray(new int[0][]); }\n  static String[] stringArray(String s) { Matcher m=Pattern.compile("\\\"(?:\\\\\\\\.|[^\\\"\\\\\\\\])*\\\"").matcher(s); List<String> values=new ArrayList<>(); while(m.find()) values.add(unquote(m.group())); return values.toArray(new String[0]); }\n  static String json(Object v) { if(v==null)return "null"; if(v instanceof Boolean||v instanceof Number)return v.toString(); if(v instanceof String)return "\\\""+((String)v).replace("\\\\","\\\\\\\\").replace("\\\"","\\\\\\\"").replace("\\n","\\\\n")+"\\\""; if(v instanceof Iterable<?>){StringJoiner j=new StringJoiner(",","[","]");for(Object x:(Iterable<?>)v)j.add(json(x));return j.toString();} if(v.getClass().isArray()){StringJoiner j=new StringJoiner(",","[","]");for(int i=0;i<Array.getLength(v);i++)j.add(json(Array.get(v,i)));return j.toString();} throw new IllegalArgumentException("Unsupported result"); }\n}\n`;
}

export function makePracticeExecution(
  problem: Pick<PracticeProblem, "id" | "title">,
  language: PracticeLanguage,
  code: string,
  input: unknown,
): { source: string; stdin: string } {
  const adapter = ADAPTERS[problem.id];
  if (!adapter) throw new Error(`Local harness is not available for ${problem.title}.`);
  const source = language === "Python" ? pythonHarness(adapter, code)
    : language === "JavaScript" ? javascriptHarness(adapter, code)
      : language === "C++" ? cppHarness(adapter, code)
        : javaHarness(adapter, code);
  return { source, stdin: makePracticeStdin(problem, input) };
}

/** Serialize a validated catalog case into the exact harness input format.
 * The server uses this to sign the runtime-ready cases, so the browser cannot
 * swap expected output or test inputs after publication. */
export function makePracticeStdin(problem: Pick<PracticeProblem, "id" | "title">, input: unknown): string {
  const adapter = ADAPTERS[problem.id];
  if (!adapter) throw new Error(`Local harness is not available for ${problem.title}.`);
  const args = normalizeArguments(adapter, input);
  return `${args.map((value) => JSON.stringify(value)).join("\n")}\n`;
}

export function parseExpectedOutput(testCase: PracticeTestCase): unknown {
  try { return JSON.parse(testCase.expectedOutput); } catch { return testCase.expectedOutput; }
}

export function parseExecutionOutput(stdout: string): unknown {
  const output = stdout.trim();
  try { return JSON.parse(output); } catch { return output; }
}

export function canonicalizeResult(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((part) => canonicalizeResult(part)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, part]) => `${JSON.stringify(key)}:${canonicalizeResult(part)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function supportsPracticeHarness(problem: PracticeProblem, language: string): language is PracticeLanguage {
  return Boolean(ADAPTERS[problem.id]) && ["Java", "C++", "Python", "JavaScript"].includes(language);
}

export interface PracticeTestCase {
  id: number;
  name: string;
  input: string;
  rawInput: unknown;
  expectedOutput: string;
}

export const PRACTICE_TEST_PACKS: Record<string, PracticeTestCase[]> = {
  'move-zeroes': [
      { id: 1, name: 'Case 1', input: '[0,1,0,3,12]', rawInput: [0, 1, 0, 3, 12], expectedOutput: '[1,3,12,0,0]' },
      { id: 2, name: 'Case 2', input: '[0]', rawInput: [0], expectedOutput: '[0]' },
      { id: 3, name: 'Case 3', input: '[1,0,2,0,3]', rawInput: [1, 0, 2, 0, 3], expectedOutput: '[1,2,3,0,0]' },
      { id: 4, name: 'Case 4', input: '[4,2,4,0,0,3,0,5,1,0]', rawInput: [4, 2, 4, 0, 0, 3, 0, 5, 1, 0], expectedOutput: '[4,2,4,3,5,1,0,0,0,0]' },
      { id: 5, name: 'Case 5', input: '[1]', rawInput: [1], expectedOutput: '[1]' },
      { id: 6, name: 'Case 6', input: '[0,0,1]', rawInput: [0, 0, 1], expectedOutput: '[1,0,0]' },
      { id: 7, name: 'Case 7', input: '[2,1]', rawInput: [2, 1], expectedOutput: '[2,1]' },
    ],
  'majority-element': [
      { id: 1, name: 'Case 1', input: '[3,2,3]', rawInput: [3, 2, 3], expectedOutput: '3' },
      { id: 2, name: 'Case 2', input: '[2,2,1,1,1,2,2]', rawInput: [2, 2, 1, 1, 1, 2, 2], expectedOutput: '2' },
      { id: 3, name: 'Case 3', input: '[1]', rawInput: [1], expectedOutput: '1' },
      { id: 4, name: 'Case 4', input: '[6,5,5]', rawInput: [6, 5, 5], expectedOutput: '5' },
    ],
  'remove-duplicates-from-sorted-array': [
      { id: 1, name: 'Case 1', input: '[1,1,2]', rawInput: [1, 1, 2], expectedOutput: '2' },
      { id: 2, name: 'Case 2', input: '[0,0,1,1,1,2,2,3,3,4]', rawInput: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], expectedOutput: '5' },
    ],
  'best-time-to-buy-and-sell-stock': [
      { id: 1, name: 'Case 1', input: '[7,1,5,3,6,4]', rawInput: [7, 1, 5, 3, 6, 4], expectedOutput: '5' },
      { id: 2, name: 'Case 2', input: '[7,6,4,3,1]', rawInput: [7, 6, 4, 3, 1], expectedOutput: '0' },
    ],
  'rotate-array': [
      { id: 1, name: 'Case 1', input: 'nums = [1,2,3,4,5,6,7], k = 3', rawInput: [[1, 2, 3, 4, 5, 6, 7], 3], expectedOutput: '[5,6,7,1,2,3,4]' },
      { id: 2, name: 'Case 2', input: 'nums = [-1,-100,3,99], k = 2', rawInput: [[-1, -100, 3, 99], 2], expectedOutput: '[3,99,-1,-100]' },
    ],
  'product-of-array-except-self': [
      { id: 1, name: 'Case 1', input: '[1,2,3,4]', rawInput: [1, 2, 3, 4], expectedOutput: '[24,12,8,6]' },
      { id: 2, name: 'Case 2', input: '[-1,1,0,-3,3]', rawInput: [-1, 1, 0, -3, 3], expectedOutput: '[0,0,9,0,0]' },
    ],
  'valid-palindrome': [
          { id: 1, name: 'Case 1', input: '"A man, a plan, a canal: Panama"', rawInput: "A man, a plan, a canal: Panama", expectedOutput: 'true' },
          { id: 2, name: 'Case 2', input: '"race a car"', rawInput: "race a car", expectedOutput: 'false' },
        ],
  'trapping-rain-water': [
          { id: 1, name: 'Case 1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', rawInput: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], expectedOutput: '6' },
        ],
  'calculate-system-availability': [
      {
        id: 1,
        name: 'Case 1 (Series)',
        input: 'availabilities = [0.99, 0.999], type = "series"',
        rawInput: { availabilities: [0.99, 0.999], type: 'series' },
        expectedOutput: '0.989',
      },
      {
        id: 2,
        name: 'Case 2 (Parallel)',
        input: 'availabilities = [0.99, 0.99], type = "parallel"',
        rawInput: { availabilities: [0.99, 0.99], type: 'parallel' },
        expectedOutput: '0.9999',
      },
    ],
  'solve-littles-law': [
      {
        id: 1,
        name: 'Case 1',
        input: 'throughput = 1000, latencyMs = 250',
        rawInput: { throughput: 1000, latencyMs: 250 },
        expectedOutput: '250',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'throughput = 500, latencyMs = 35',
        rawInput: { throughput: 500, latencyMs: 35 },
        expectedOutput: '18',
      },
    ],
  'plan-reliability-recovery-targets': [
      {
        id: 1,
        name: 'Case 1',
        input: 'mtbfHours = 720, targetAvailability = 0.999',
        rawInput: { mtbfHours: 720, targetAvailability: 0.999 },
        expectedOutput: '43',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'mtbfHours = 100, targetAvailability = 0.99',
        rawInput: { mtbfHours: 100, targetAvailability: 0.99 },
        expectedOutput: '60',
      },
    ],
  'calculate-amdahls-law-speedup': [
      {
        id: 1,
        name: 'Case 1',
        input: 'p = 0.95, n = 10',
        rawInput: { p: 0.95, n: 10 },
        expectedOutput: '6.9',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'p = 0.5, n = 5',
        rawInput: { p: 0.5, n: 5 },
        expectedOutput: '1.67',
      },
    ],
  'find-keys-reassigned-after-node-removal': [
      {
        id: 1,
        name: 'Case 1',
        input: 'nodes = [100, 300, 700], keys = [50, 150, 250, 600, 800], removedIndex = 1',
        rawInput: { nodes: [100, 300, 700], keys: [50, 150, 250, 600, 800], removedIndex: 1 },
        expectedOutput: '2',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'nodes = [200, 500], keys = [100, 600], removedIndex = 0',
        rawInput: { nodes: [200, 500], keys: [100, 600], removedIndex: 0 },
        expectedOutput: '2',
      },
    ],
  'design-token-bucket-rate-limiter': [
      {
        id: 1,
        name: 'Case 1',
        input: 'capacity = 5, refillRate = 1, requests = [[0, 3], [1, 2], [1, 2]]',
        rawInput: { capacity: 5, refillRate: 1, requests: [[0, 3], [1, 2], [1, 2]] },
        expectedOutput: '[true, true, false]',
      },
    ],
  'print-foobar-alternately': [
      {
        id: 1,
        name: 'Case 1',
        input: 'n = 1',
        rawInput: 1,
        expectedOutput: '"foobar"',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'n = 2',
        rawInput: 2,
        expectedOutput: '"foobarfoobar"',
      },
      {
        id: 3,
        name: 'Repeated concurrent handoff',
        input: 'n = 10',
        rawInput: 10,
        expectedOutput: '"foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar"',
      },
    ],
  'design-bounded-blocking-queue': [
      {
        id: 1,
        name: 'Producer blocks at capacity',
        input: 'capacity = 2, items = [10, 20, 30, 40, 50]',
        rawInput: { capacity: 2, items: [10, 20, 30, 40, 50] },
        expectedOutput: '[10,20,30,40,50]',
      },
      {
        id: 2,
        name: 'Single-slot queue drains in order',
        input: 'capacity = 1, items = [5, 4, 3, 2]',
        rawInput: { capacity: 1, items: [5, 4, 3, 2] },
        expectedOutput: '[5,4,3,2]',
      },
    ],
  'zero-even-odd': [
      {
        id: 1,
        name: 'Case 1',
        input: 'n = 2',
        rawInput: 2,
        expectedOutput: '"0102"',
      },
      {
        id: 2,
        name: 'Odd and even handoffs',
        input: 'n = 5',
        rawInput: 5,
        expectedOutput: '"0102030405"',
      },
    ],
  'building-h2o-molecule': [
      {
        id: 1,
        name: 'Case 1',
        input: 'water = "HOH"',
        rawInput: "HOH",
        expectedOutput: '{"valid":true,"molecules":1}',
      },
      {
        id: 2,
        name: 'Two complete molecule groups',
        input: 'water = "HHOHHO"',
        rawInput: "HHOHHO",
        expectedOutput: '{"valid":true,"molecules":2}',
      },
    ],
  'the-dining-philosophers': [
      {
        id: 1,
        name: 'Case 1',
        input: 'philosophers = 5, iterations = 1',
        rawInput: 1,
        expectedOutput: '{"valid":true,"meals":5}',
      },
      {
        id: 2,
        name: 'Each philosopher eats twice',
        input: 'philosophers = 5, iterations = 2',
        rawInput: 2,
        expectedOutput: '{"valid":true,"meals":10}',
      },
    ],
  'read-write-lock-implementation': [
      {
        id: 1,
        name: 'Case 1',
        input: 'readers = 3, writers = 1; writer preference over a later reader',
        rawInput: { readers: 3, writers: 1 },
        expectedOutput: '{"valid":true,"max_concurrent_readers":3,"writer_precedes_late_reader":true}',
      },
    ],
  'design-parking-lot-system': [
      {
        id: 1,
        name: 'Case 1',
        input: 'ParkingSystem(1, 1, 0), addCar(1), addCar(2), addCar(3), addCar(1)',
        rawInput: { constructorArgs: [1, 1, 0], carTypes: [1, 2, 3, 1] },
        expectedOutput: '[true, true, false, false]',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'ParkingSystem(0, 1, 1), addCar(1), addCar(2), addCar(3), addCar(2), addCar(3)',
        rawInput: { constructorArgs: [0, 1, 1], carTypes: [1, 2, 3, 2, 3] },
        expectedOutput: '[false, true, true, false, false]',
      },
    ],
  'design-lru-cache-with-ttl': [
      {
        id: 1,
        name: 'Case 1',
        input: 'put(1, 10, ttl=5, t=0), get(1, t=3), get(1, t=6)',
        rawInput: { capacity: 2, operations: [[1, 1, 10, 5, 0], [0, 1, 3], [0, 1, 6]] },
        expectedOutput: '[10, -1]',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'put(1, 2, ttl=10, t=0), put(2, 3, ttl=10, t=1), get(1, t=2), get(2, t=2)',
        rawInput: { capacity: 1, operations: [[1, 1, 2, 10, 0], [1, 2, 3, 10, 1], [0, 1, 2], [0, 2, 2]] },
        expectedOutput: '[-1,3]',
      },
    ],
  'design-snake-and-ladder-game': [
      {
        id: 1,
        name: 'Case 1',
        input: 'snakes = [[16, 6]], ladders = [[2, 38]], currentPos = 0, diceRoll = 2',
        rawInput: { snakes: [[16, 6]], ladders: [[2, 38]], currentPos: 0, diceRoll: 2 },
        expectedOutput: '38',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'snakes = [], ladders = [], currentPos = 98, diceRoll = 3',
        rawInput: { snakes: [], ladders: [], currentPos: 98, diceRoll: 3 },
        expectedOutput: '98',
      },
    ],
  'design-in-memory-file-system': [
      {
        id: 1,
        name: 'Case 1',
        input: 'mkdir("/a/b/c"), addContentToFile("/a/b/c/d", "hello"), readContentFromFile("/a/b/c/d")',
        rawInput: { operations: [1, 2, 3], paths: ['/a/b/c', '/a/b/c/d', '/a/b/c/d'], contents: ['', 'hello', ''] },
        expectedOutput: '["hello"]',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'mkdir("/dir"), addContentToFile("/dir/a", "hello"), ls("/dir"), readContentFromFile("/dir/a")',
        rawInput: { operations: [1, 2, 4, 3], paths: ['/dir', '/dir/a', '/dir', '/dir/a'], contents: ['', 'hello', '', ''] },
        expectedOutput: '[["a"],"hello"]',
      },
    ],
  'design-notification-service': [
      {
        id: 1,
        name: 'Case 1',
        input: 'subscribe("ORDER", "Email"), notify("ORDER", "Shipped")',
        rawInput: { operations: [0, 2], eventTypes: ['ORDER', 'ORDER'], values: ['Email', 'Shipped'] },
        expectedOutput: '["[Email] Shipped"]',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'subscribe("ORDER", "Email"), subscribe("ORDER", "SMS"), unsubscribe("ORDER", "Email"), notify("ORDER", "Shipped")',
        rawInput: { operations: [0, 0, 1, 2], eventTypes: ['ORDER', 'ORDER', 'ORDER', 'ORDER'], values: ['Email', 'SMS', 'Email', 'Shipped'] },
        expectedOutput: '["[SMS] Shipped"]',
      },
    ],
  'design-tic-tac-toe': [
      {
        id: 1,
        name: 'Case 1',
        input: 'TicTacToe(3), move(0, 0, 1), move(1, 1, 1), move(2, 2, 1)',
        rawInput: { n: 3, moves: [[0, 0, 1], [1, 1, 1], [2, 2, 1]] },
        expectedOutput: '[0, 0, 1]',
      },
      {
        id: 2,
        name: 'Case 2',
        input: 'TicTacToe(3), moves = [[0,0,1],[0,1,2],[1,0,1],[1,1,2],[2,2,1],[2,1,2]]',
        rawInput: { n: 3, moves: [[0, 0, 1], [0, 1, 2], [1, 0, 1], [1, 1, 2], [2, 2, 1], [2, 1, 2]] },
        expectedOutput: '[0, 0, 0, 0, 0, 2]',
      },
    ],
};

export type PracticeCheckerV1 =
  | { kind: "json_value_v1" }
  | {
      kind: "float_tolerance_v1";
      absolute_tolerance: number;
      relative_tolerance: number;
    };

export const PRACTICE_TEST_CHECKERS: Record<string, PracticeCheckerV1> = {
  "calculate-system-availability": {
    kind: "float_tolerance_v1",
    absolute_tolerance: 0.0001,
    relative_tolerance: 0,
  },
  "calculate-amdahls-law-speedup": {
    kind: "float_tolerance_v1",
    absolute_tolerance: 0.005,
    relative_tolerance: 0,
  },
};

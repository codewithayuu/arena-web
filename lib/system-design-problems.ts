import { PracticeProblem } from './practice-problems';

export const SYSTEM_DESIGN_PROBLEMS: PracticeProblem[] = [
  {
    id: 'calculate-system-availability',
    slug: 'calculate-system-availability',
    title: 'Calculate System Availability',
    difficulty: 'Easy',
    category: 'Core Concepts',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Availability', 'Reliability', 'Probability'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
    description: `In distributed system design, high availability (HA) is a core requirement. Availability is often measured by the percentage of time a system remains operational and accessible.

When services are arranged in **series** (a request must sequentially pass through each service), the overall availability is the product of individual availabilities:
$$A_{series} = \\prod_{i=1}^{n} A_i = A_1 \\times A_2 \\times \\dots \\times A_n$$

When services are configured in **parallel** (redundant replicas with automatic failover), the system fails only if *all* redundant instances fail simultaneously:
$$A_{parallel} = 1 - \\prod_{i=1}^{n} (1 - A_i) = 1 - (1 - A_1) \\times (1 - A_2) \\times \\dots \\times (1 - A_n)$$

Given an array of decimal availability values \`availabilities\` (e.g., \`[0.99, 0.999]\` representing 99% and 99.9%) and a string \`type\` which is either \`"series"\` or \`"parallel"\`, return the composite availability rounded to 4 decimal places.`,
    note: 'Round the final composite availability to 4 decimal places (e.g. 0.9890).',
    examples: [
      {
        id: 1,
        input: 'availabilities = [0.99, 0.999], type = "series"',
        output: '0.989',
        explanation: 'Series availability = 0.99 * 0.999 = 0.98901, rounded to 4 decimal places is 0.989.',
      },
      {
        id: 2,
        input: 'availabilities = [0.99, 0.99], type = "parallel"',
        output: '0.9999',
        explanation: 'Parallel availability = 1 - (1 - 0.99) * (1 - 0.99) = 1 - (0.01 * 0.01) = 0.9999.',
      },
    ],
    constraints: [
      '1 <= availabilities.length <= 100',
      '0.0 < availabilities[i] <= 1.0',
      'type is either "series" or "parallel"',
    ],
    starterCodes: {
      Java: `class Solution {
    public double calculateAvailability(double[] availabilities, String type) {
        // Write your code here
        return 0.0;
    }
}`,
      Python: `class Solution:
    def calculateAvailability(self, availabilities: list[float], type: str) -> float:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    double calculateAvailability(vector<double>& availabilities, string type) {
        // Write your code here
        return 0.0;
    }
};`,
      JavaScript: `/**
 * @param {number[]} availabilities
 * @param {string} type
 * @return {number}
 */
var calculateAvailability = function(availabilities, type) {
    // Write your code here
};`,
      TypeScript: `function calculateAvailability(availabilities: number[], type: string): number {
    // Write your code here
    return 0.0;
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public double calculateAvailability(double[] availabilities, String type) {
        if ("parallel".equalsIgnoreCase(type)) {
            double unavail = 1.0;
            for (double a : availabilities) {
                unavail *= (1.0 - a);
            }
            return Math.round((1.0 - unavail) * 10000.0) / 10000.0;
        } else {
            double avail = 1.0;
            for (double a : availabilities) {
                avail *= a;
            }
            return Math.round(avail * 10000.0) / 10000.0;
        }
    }
}`,
      Python: `class Solution:
    def calculateAvailability(self, availabilities: list[float], type: str) -> float:
        if type == "parallel":
            unavail = 1.0
            for a in availabilities:
                unavail *= (1.0 - a)
            return round(1.0 - unavail, 4)
        else:
            avail = 1.0
            for a in availabilities:
                avail *= a
            return round(avail, 4)`,
      'C++': `class Solution {
public:
    double calculateAvailability(vector<double>& availabilities, string type) {
        if (type == "parallel") {
            double unavail = 1.0;
            for (double a : availabilities) {
                unavail *= (1.0 - a);
            }
            return round((1.0 - unavail) * 10000.0) / 10000.0;
        } else {
            double avail = 1.0;
            for (double a : availabilities) {
                avail *= a;
            }
            return round(avail * 10000.0) / 10000.0;
        }
    }
};`,
      JavaScript: `var calculateAvailability = function(availabilities, type) {
    if (type === "parallel") {
        let unavail = 1.0;
        for (const a of availabilities) {
            unavail *= (1.0 - a);
        }
        return Number((1.0 - unavail).toFixed(4));
    } else {
        let avail = 1.0;
        for (const a of availabilities) {
            avail *= a;
        }
        return Number(avail.toFixed(4));
    }
};`,
    },
  },
  {
    id: 'solve-littles-law',
    slug: 'solve-littles-law',
    title: "Solve Little's Law",
    difficulty: 'Easy',
    category: 'Core Concepts',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Latency', 'Throughput', 'Queueing'],
    companies: ['Google', 'Uber', 'Netflix'],
    description: `Little's Law is one of the most critical equations in system performance engineering and capacity planning:
$$L = \\lambda \\times W$$

Where:
- $L$ is the average number of concurrent requests in the system.
- $\\lambda$ is the long-term average arrival rate (throughput in requests per second).
- $W$ is the average time a request spends in the system (latency in seconds).

Given the throughput $\\lambda$ (in requests/sec) and average latency $W_{ms}$ (in milliseconds), calculate the required system concurrency capacity $L$.

Return $L$ rounded up to the nearest integer (ceiling) to ensure the system is provisioned safely.`,
    note: 'Note that latency is provided in milliseconds (ms), which must be converted to seconds.',
    examples: [
      {
        id: 1,
        input: 'throughput = 1000, latencyMs = 250',
        output: '250',
        explanation: 'W = 250ms = 0.25s. L = 1000 * 0.25 = 250 concurrent requests.',
      },
      {
        id: 2,
        input: 'throughput = 500, latencyMs = 35',
        output: '18',
        explanation: 'W = 0.035s. L = 500 * 0.035 = 17.5. Ceiling is 18.',
      },
    ],
    constraints: [
      '1 <= throughput <= 10^7 (req/sec)',
      '1 <= latencyMs <= 60000 (ms)',
    ],
    starterCodes: {
      Java: `class Solution {
    public int solveLittlesLaw(int throughput, int latencyMs) {
        // Write your code here
        return 0;
    }
}`,
      Python: `class Solution:
    def solveLittlesLaw(self, throughput: int, latencyMs: int) -> int:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    int solveLittlesLaw(int throughput, int latencyMs) {
        // Write your code here
        return 0;
    }
};`,
      JavaScript: `/**
 * @param {number} throughput
 * @param {number} latencyMs
 * @return {number}
 */
var solveLittlesLaw = function(throughput, latencyMs) {
    // Write your code here
};`,
      TypeScript: `function solveLittlesLaw(throughput: number, latencyMs: number): number {
    // Write your code here
    return 0;
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public int solveLittlesLaw(int throughput, int latencyMs) {
        double wSec = latencyMs / 1000.0;
        return (int) Math.ceil(throughput * wSec);
    }
}`,
      Python: `import math

class Solution:
    def solveLittlesLaw(self, throughput: int, latencyMs: int) -> int:
        w_sec = latencyMs / 1000.0
        return math.ceil(throughput * w_sec)`,
      'C++': `class Solution {
public:
    int solveLittlesLaw(int throughput, int latencyMs) {
        double wSec = latencyMs / 1000.0;
        return (int) ceil(throughput * wSec);
    }
};`,
      JavaScript: `var solveLittlesLaw = function(throughput, latencyMs) {
    const wSec = latencyMs / 1000;
    return Math.ceil(throughput * wSec);
};`,
    },
  },
  {
    id: 'plan-reliability-recovery-targets',
    slug: 'plan-reliability-recovery-targets',
    title: 'Plan Reliability Recovery Targets',
    difficulty: 'Easy',
    category: 'Core Concepts',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Reliability', 'MTBF', 'MTTR'],
    companies: ['Amazon', 'Microsoft', 'Google'],
    description: `System reliability depends on two fundamental operational metrics:
- **MTBF** (Mean Time Between Failures): The average operating hours of service uptime before a failure occurs.
- **MTTR** (Mean Time To Repair): The average time required to recover and restore the service when an outage occurs.

System Availability $A$ is modeled as:
$$A = \\frac{MTBF}{MTBF + MTTR}$$

Given a service with an expected MTBF (in hours) and a strict target Availability SLA (expressed as a decimal, e.g., 0.999 for 99.9% availability), compute the **maximum allowable MTTR in minutes** to meet or exceed the target SLA.

Round down to the nearest integer minute (floor) so the recovery target stays within the SLA guarantee.`,
    note: 'Output should be in whole minutes (floor).',
    examples: [
      {
        id: 1,
        input: 'mtbfHours = 720, targetAvailability = 0.999',
        output: '43',
        explanation: 'With 720 hours MTBF and 99.9% uptime, allowable MTTR = 720 * (1 - 0.999) / 0.999 = 0.7207 hours = 43.24 minutes. Floor is 43 minutes.',
      },
      {
        id: 2,
        input: 'mtbfHours = 100, targetAvailability = 0.99',
        output: '60',
        explanation: 'Allowable MTTR = 100 * 0.01 / 0.99 = 1.0101 hours = 60.6 minutes. Floor is 60 minutes.',
      },
    ],
    constraints: [
      '1 <= mtbfHours <= 100000',
      '0.8 <= targetAvailability < 1.0',
    ],
    starterCodes: {
      Java: `class Solution {
    public int calculateMaxMttrMinutes(int mtbfHours, double targetAvailability) {
        // Write your code here
        return 0;
    }
}`,
      Python: `class Solution:
    def calculateMaxMttrMinutes(self, mtbfHours: int, targetAvailability: float) -> int:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    int calculateMaxMttrMinutes(int mtbfHours, double targetAvailability) {
        // Write your code here
        return 0;
    }
};`,
      JavaScript: `/**
 * @param {number} mtbfHours
 * @param {number} targetAvailability
 * @return {number}
 */
var calculateMaxMttrMinutes = function(mtbfHours, targetAvailability) {
    // Write your code here
};`,
      TypeScript: `function calculateMaxMttrMinutes(mtbfHours: number, targetAvailability: number): number {
    // Write your code here
    return 0;
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public int calculateMaxMttrMinutes(int mtbfHours, double targetAvailability) {
        double mttrHours = mtbfHours * (1.0 - targetAvailability) / targetAvailability;
        return (int) Math.floor(mttrHours * 60.0);
    }
}`,
      Python: `import math

class Solution:
    def calculateMaxMttrMinutes(self, mtbfHours: int, targetAvailability: float) -> int:
        mttr_hours = mtbfHours * (1.0 - targetAvailability) / targetAvailability
        return math.floor(mttr_hours * 60.0)`,
      'C++': `class Solution {
public:
    int calculateMaxMttrMinutes(int mtbfHours, double targetAvailability) {
        double mttrHours = mtbfHours * (1.0 - targetAvailability) / targetAvailability;
        return (int) floor(mttrHours * 60.0);
    }
};`,
      JavaScript: `var calculateMaxMttrMinutes = function(mtbfHours, targetAvailability) {
    const mttrHours = mtbfHours * (1.0 - targetAvailability) / targetAvailability;
    return Math.floor(mttrHours * 60.0);
};`,
    },
  },
  {
    id: 'calculate-amdahls-law-speedup',
    slug: 'calculate-amdahls-law-speedup',
    title: "Calculate Amdahl's Law Speedup",
    difficulty: 'Easy',
    category: 'Core Concepts',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Scalability', 'Parallelism', 'Math'],
    companies: ['Google', 'Meta', 'Apple'],
    description: `Amdahl's Law predicts the maximum theoretical speedup in execution time of a computing workload when scaling out horizontally with parallel processors:
$$S(N) = \\frac{1}{(1 - p) + \\frac{p}{N}}$$

Where:
- $p$ is the fraction of the workload that is parallelizable ($0 \\le p \\le 1$).
- $1 - p$ is the strictly serial portion that cannot be parallelized.
- $N$ is the number of worker nodes / processor cores ($N \\ge 1$).

Given $p$ and $N$, calculate the overall system speedup $S(N)$ rounded to 2 decimal places.`,
    note: 'Round the final speedup to 2 decimal places.',
    examples: [
      {
        id: 1,
        input: 'p = 0.95, n = 10',
        output: '6.9',
        explanation: 'S = 1 / ((1 - 0.95) + (0.95 / 10)) = 1 / (0.05 + 0.095) = 1 / 0.145 = 6.8965... Rounded to 2 decimals is 6.9.',
      },
      {
        id: 2,
        input: 'p = 0.5, n = 5',
        output: '1.67',
        explanation: 'S = 1 / (0.5 + 0.1) = 1 / 0.6 = 1.666... Rounded to 2 decimals is 1.67.',
      },
    ],
    constraints: [
      '0.0 <= p <= 1.0',
      '1 <= n <= 10000',
    ],
    starterCodes: {
      Java: `class Solution {
    public double calculateSpeedup(double p, int n) {
        // Write your code here
        return 0.0;
    }
}`,
      Python: `class Solution:
    def calculateSpeedup(self, p: float, n: int) -> float:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    double calculateSpeedup(double p, int n) {
        // Write your code here
        return 0.0;
    }
};`,
      JavaScript: `/**
 * @param {number} p
 * @param {number} n
 * @return {number}
 */
var calculateSpeedup = function(p, n) {
    // Write your code here
};`,
      TypeScript: `function calculateSpeedup(p: number, n: number): number {
    // Write your code here
    return 0.0;
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public double calculateSpeedup(double p, int n) {
        double denominator = (1.0 - p) + (p / n);
        return Math.round((1.0 / denominator) * 100.0) / 100.0;
    }
}`,
      Python: `class Solution:
    def calculateSpeedup(self, p: float, n: int) -> float:
        denom = (1.0 - p) + (p / n)
        return round(1.0 / denom, 2)`,
      'C++': `class Solution {
public:
    double calculateSpeedup(double p, int n) {
        double denom = (1.0 - p) + (p / n);
        return round((1.0 / denom) * 100.0) / 100.0;
    }
};`,
      JavaScript: `var calculateSpeedup = function(p, n) {
    const denom = (1.0 - p) + (p / n);
    return Number((1.0 / denom).toFixed(2));
};`,
    },
  },
  {
    id: 'find-keys-reassigned-after-node-removal',
    slug: 'find-keys-reassigned-after-node-removal',
    title: 'Find Keys Reassigned After Node Removal',
    difficulty: 'Medium',
    category: 'Core Concepts',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Consistent Hashing', 'Hashing', 'Distributed Systems'],
    companies: ['Google', 'Amazon', 'Meta', 'Uber'],
    description: `Consistent Hashing is the gold standard for distributing cache data across a dynamic cluster of storage nodes.

Consider a consistent hash ring with integer space $[0, M - 1]$. 
- There are $N$ distinct nodes placed at sorted integer coordinates \`nodes\`.
- There are $K$ cached keys placed at integer coordinates \`keys\`.
- Each key is assigned to the first node with coordinate $\\ge key$ (wrapping around to \`nodes[0]\` if the key is greater than all nodes).

When a node at index \`removedIndex\` is abruptly decommissioned, all keys that were previously assigned to this node must be migrated to its clockwise successor.

Return the total count of keys that must be reassigned.`,
    note: 'The nodes array is guaranteed to be strictly increasing and sorted.',
    examples: [
      {
        id: 1,
        input: 'nodes = [100, 300, 700], keys = [50, 150, 250, 600, 800], removedIndex = 1',
        output: '2',
        explanation: 'Node at index 1 is at pos 300. Keys assigned to node 300 were 150 and 250 (both > 100 and <= 300). So 2 keys are reassigned.',
      },
      {
        id: 2,
        input: 'nodes = [200, 500], keys = [100, 600], removedIndex = 0',
        output: '2',
        explanation: 'Keys 100 (<= 200) and 600 (> 500, wraps around to 200) both belonged to node 200. Thus 2 keys are reassigned.',
      },
    ],
    constraints: [
      '2 <= nodes.length <= 10^4',
      '1 <= keys.length <= 10^5',
      '0 <= removedIndex < nodes.length',
      '0 <= nodes[i], keys[j] < 10^9',
    ],
    starterCodes: {
      Java: `class Solution {
    public int countReassignedKeys(int[] nodes, int[] keys, int removedIndex) {
        // Write your code here
        return 0;
    }
}`,
      Python: `class Solution:
    def countReassignedKeys(self, nodes: list[int], keys: list[int], removedIndex: int) -> int:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    int countReassignedKeys(vector<int>& nodes, vector<int>& keys, int removedIndex) {
        // Write your code here
        return 0;
    }
};`,
      JavaScript: `/**
 * @param {number[]} nodes
 * @param {number[]} keys
 * @param {number} removedIndex
 * @return {number}
 */
var countReassignedKeys = function(nodes, keys, removedIndex) {
    // Write your code here
};`,
      TypeScript: `function countReassignedKeys(nodes: number[], keys: number[], removedIndex: number): number {
    // Write your code here
    return 0;
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public int countReassignedKeys(int[] nodes, int[] keys, int removedIndex) {
        int targetNode = nodes[removedIndex];
        int count = 0;
        for (int k : keys) {
            int assigned = -1;
            for (int n : nodes) {
                if (n >= k) {
                    assigned = n;
                    break;
                }
            }
            if (assigned == -1) assigned = nodes[0];
            if (assigned == targetNode) count++;
        }
        return count;
    }
}`,
      Python: `class Solution:
    def countReassignedKeys(self, nodes: list[int], keys: list[int], removedIndex: int) -> int:
        target_node = nodes[removedIndex]
        count = 0
        for k in keys:
            assigned = None
            for n in nodes:
                if n >= k:
                    assigned = n
                    break
            if assigned is None:
                assigned = nodes[0]
            if assigned == target_node:
                count += 1
        return count`,
      'C++': `class Solution {
public:
    int countReassignedKeys(vector<int>& nodes, vector<int>& keys, int removedIndex) {
        int targetNode = nodes[removedIndex];
        int count = 0;
        for (int k : keys) {
            auto it = lower_bound(nodes.begin(), nodes.end(), k);
            int assigned = (it != nodes.end()) ? *it : nodes[0];
            if (assigned == targetNode) count++;
        }
        return count;
    }
};`,
      JavaScript: `var countReassignedKeys = function(nodes, keys, removedIndex) {
    const targetNode = nodes[removedIndex];
    let count = 0;
    for (const k of keys) {
        let assigned = nodes.find(n => n >= k);
        if (assigned === undefined) assigned = nodes[0];
        if (assigned === targetNode) count++;
    }
    return count;
};`,
    },
  },
  {
    id: 'design-token-bucket-rate-limiter',
    slug: 'design-token-bucket-rate-limiter',
    title: 'Design Token Bucket Rate Limiter',
    difficulty: 'Medium',
    category: 'Core Concepts',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/system-design',
    topics: ['Rate Limiting', 'Algorithms', 'Distributed Systems'],
    companies: ['Stripe', 'Cloudflare', 'Google', 'Amazon'],
    description: `Rate limiting protects APIs from abusive traffic and denial-of-service spikes. One of the most popular algorithms is the **Token Bucket**.

The bucket has:
- A maximum \`capacity\` of tokens.
- A steady \`refillRate\` (tokens added per second).
- Initially, the bucket starts completely full with \`capacity\` tokens.

Given an array of request events, each formatted as \`[timestamp, tokensNeeded]\` (where timestamps are in ascending seconds), return a boolean array where the $i$-th element is \`true\` if request $i$ was allowed (and consumed tokens), or \`false\` if it was dropped/throttled.`,
    note: 'Tokens refill continuously according to the elapsed seconds, capped at maximum capacity.',
    examples: [
      {
        id: 1,
        input: 'capacity = 5, refillRate = 1, requests = [[0, 3], [1, 2], [1, 2]]',
        output: '[true, true, false]',
        explanation: 'At t=0, bucket has 5 tokens. Consume 3 -> 2 tokens left. At t=1, 1 second passed -> refill 1 token -> 3 tokens. Consume 2 -> 1 token left. Second request at t=1 needs 2 tokens, but only 1 left -> rejected (false).',
      },
    ],
    constraints: [
      '1 <= capacity <= 10^6',
      '1 <= refillRate <= 10^6',
      '1 <= requests.length <= 1000',
    ],
    starterCodes: {
      Java: `class Solution {
    public boolean[] simulateRateLimiter(int capacity, int refillRate, int[][] requests) {
        // Write your code here
        return new boolean[requests.length];
    }
}`,
      Python: `class Solution:
    def simulateRateLimiter(self, capacity: int, refillRate: int, requests: list[list[int]]) -> list[bool]:
        # Write your code here
        pass`,
      'C++': `class Solution {
public:
    vector<bool> simulateRateLimiter(int capacity, int refillRate, vector<vector<int>>& requests) {
        // Write your code here
        return {};
    }
};`,
      JavaScript: `/**
 * @param {number} capacity
 * @param {number} refillRate
 * @param {number[][]} requests
 * @return {boolean[]}
 */
var simulateRateLimiter = function(capacity, refillRate, requests) {
    // Write your code here
};`,
      TypeScript: `function simulateRateLimiter(capacity: number, refillRate: number, requests: number[][]): boolean[] {
    // Write your code here
    return [];
};`,
    },
    solutionCode: {
      Java: `class Solution {
    public boolean[] simulateRateLimiter(int capacity, int refillRate, int[][] requests) {
        boolean[] result = new boolean[requests.length];
        double tokens = capacity;
        int lastTimestamp = requests.length > 0 ? requests[0][0] : 0;
        
        for (int i = 0; i < requests.length; i++) {
            int time = requests[i][0];
            int needed = requests[i][1];
            int delta = time - lastTimestamp;
            tokens = Math.min((double) capacity, tokens + delta * refillRate);
            lastTimestamp = time;
            
            if (tokens >= needed) {
                tokens -= needed;
                result[i] = true;
            } else {
                result[i] = false;
            }
        }
        return result;
    }
}`,
      Python: `class Solution:
    def simulateRateLimiter(self, capacity: int, refillRate: int, requests: list[list[int]]) -> list[bool]:
        tokens = float(capacity)
        last_time = requests[0][0] if requests else 0
        res = []
        for time, needed in requests:
            delta = time - last_time
            tokens = min(float(capacity), tokens + delta * refillRate)
            last_time = time
            if tokens >= needed:
                tokens -= needed
                res.append(True)
            else:
                res.append(False)
        return res`,
      'C++': `class Solution {
public:
    vector<bool> simulateRateLimiter(int capacity, int refillRate, vector<vector<int>>& requests) {
        vector<bool> result;
        double tokens = capacity;
        int lastTime = requests.empty() ? 0 : requests[0][0];
        for (auto& r : requests) {
            int time = r[0], needed = r[1];
            tokens = min((double)capacity, tokens + (time - lastTime) * refillRate);
            lastTime = time;
            if (tokens >= needed) {
                tokens -= needed;
                result.push_back(true);
            } else {
                result.push_back(false);
            }
        }
        return result;
    }
};`,
      JavaScript: `var simulateRateLimiter = function(capacity, refillRate, requests) {
    let tokens = capacity;
    let lastTime = requests.length > 0 ? requests[0][0] : 0;
    const res = [];
    for (const [time, needed] of requests) {
        tokens = Math.min(capacity, tokens + (time - lastTime) * refillRate);
        lastTime = time;
        if (tokens >= needed) {
            tokens -= needed;
            res.push(true);
        } else {
            res.push(false);
        }
    }
    return res;
};`,
    },
  },
];

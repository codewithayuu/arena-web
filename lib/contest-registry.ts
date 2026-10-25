import fs from "node:fs";
import path from "node:path";
import { ParsedContestDefinition, ParsedContestProblem } from "./contest-package-parser";
import halloweenData from "@/data/halloween-contest.json";

const CONTESTS_DIR = path.join(process.cwd(), "data", "contests");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getSeedContests(): ParsedContestDefinition[] {
  const now = new Date();
  const halloweenProblems: ParsedContestProblem[] = (halloweenData as any).problems || [];

  const halloweenContest: ParsedContestDefinition = {
    contest_id: "halloween-hollow-hill-div3",
    name: "🎃 Hollow Hill Halloween Contest (Div. 3)",
    description: "7 original themed competitive programming problems (A through G). Local on-device AI proctoring active with MediaPipe Face Landmarker & BlazeGaze iris tracking.",
    editorial_markdown: "",
    starts_at: new Date(now.getTime() - 3600000).toISOString(),
    ends_at: new Date(now.getTime() + 86400000 * 7).toISOString(),
    duration_minutes: 180,
    languages: ["cpp17", "cpp20", "python", "java", "javascript"],
    problems: halloweenProblems,
    mock_mode: true,
    proctoring: {
      enabled: true,
      webcam_required: true,
      gaze_tracking: true,
      admin_ws_url: "ws://127.0.0.1:8765",
      capture_interval_ms: 1000,
    },
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const deadlockContest: ParsedContestDefinition = {
    contest_id: "dead10c2-2026-4000-8000-000000000026",
    name: "DEADLOCK '26 — Agent Arena: Containment",
    description: "Official contest round with local sandbox containment and on-device MediaPipe biometric verification.",
    starts_at: new Date(now.getTime() - 3600000).toISOString(),
    ends_at: new Date(now.getTime() + 86400000).toISOString(),
    duration_minutes: 120,
    languages: ["cpp17", "cpp20", "python", "java", "javascript"],
    problems: [
      {
        problem_id: "dead10c2-prob-0001-8000-000000000001",
        ordinal: 1,
        slug: "containment-grid-allocation",
        title: "A. Containment Grid Allocation",
        statement_markdown: "# A. Containment Grid Allocation\n\n### Problem Description\nThe research installation containment grid consists of $N$ sectors arranged linearly from $1$ to $N$. Each sector has an initial containment integrity $A_i$.\n\nIn each operation, you can deploy a stabilization pulse to any sector $i$, which increases $A_i$ by $K$, and decreases adjacent sectors $A_{i-1}$ and $A_{i+1}$ (if they exist) by $\\lfloor K / 2 \\rfloor$.\n\nDetermine whether you can make all sector integrities strictly greater than zero.\n\n### Input\nThe first line contains two integers $N$ and $K$.\nThe second line contains $N$ space-separated integers $A_1, A_2, \\dots, A_N$.\n\n### Output\nPrint `YES` if all sectors can achieve positive integrity, or `NO` otherwise.\n",
        public_samples: [
          { input: "3 4\n-1 5 -1\n", output: "YES\n" },
          { input: "2 2\n-5 -5\n", output: "NO\n" },
        ],
        time_limit_ms: 1000,
        memory_limit_mb: 512,
      },
      {
        problem_id: "dead10c2-prob-0002-8000-000000000002",
        ordinal: 2,
        slug: "flux-relay-synchronization",
        title: "B. Flux Relay Synchronization",
        statement_markdown: "# B. Flux Relay Synchronization\n\n### Problem Description\nThree primary relays control energy flow in the Deadlock facility. Each relay requires a synchronized frequency match.\n\nGiven the frequencies of $M$ incoming flux packets, find the maximum number of relays that can be simultaneously activated.\n\n### Input\nThe first line contains an integer $M$.\nThe second line contains $M$ integers denoting packet frequencies.\n\n### Output\nPrint the maximum active relay count.\n",
        public_samples: [
          { input: "4\n10 20 30 40\n", output: "3\n" },
        ],
        time_limit_ms: 1000,
        memory_limit_mb: 512,
      },
    ],
    mock_mode: true,
    proctoring: {
      enabled: true,
      webcam_required: true,
      gaze_tracking: true,
      admin_ws_url: "ws://127.0.0.1:8765",
      capture_interval_ms: 1000,
    },
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  return [halloweenContest, deadlockContest];
}

export async function getAllContests(): Promise<ParsedContestDefinition[]> {
  const seedList = getSeedContests();
  ensureDirectoryExists(CONTESTS_DIR);

  const map = new Map<string, ParsedContestDefinition>();
  for (const c of seedList) {
    map.set(c.contest_id, c);
  }

  try {
    const files = fs.readdirSync(CONTESTS_DIR);
    for (const f of files) {
      if (f.endsWith(".json")) {
        try {
          const content = fs.readFileSync(path.join(CONTESTS_DIR, f), "utf8");
          const parsed = JSON.parse(content) as ParsedContestDefinition;
          if (parsed && parsed.contest_id) {
            map.set(parsed.contest_id, parsed);
          }
        } catch {
          // Ignore invalid file
        }
      }
    }
  } catch {
    // Return seeds
  }

  return Array.from(map.values());
}

export async function getContestById(contestId: string): Promise<ParsedContestDefinition | null> {
  const normalized = contestId.toLowerCase().trim();
  const all = await getAllContests();
  const found = all.find((c) => c.contest_id.toLowerCase() === normalized || c.contest_id.replace(/-/g, "") === normalized.replace(/-/g, ""));
  return found ?? null;
}

export async function saveContest(contest: ParsedContestDefinition): Promise<void> {
  ensureDirectoryExists(CONTESTS_DIR);
  const filePath = path.join(CONTESTS_DIR, `${contest.contest_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(contest, null, 2), "utf8");
}

export async function deleteContest(contestId: string): Promise<boolean> {
  ensureDirectoryExists(CONTESTS_DIR);
  const filePath = path.join(CONTESTS_DIR, `${contestId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

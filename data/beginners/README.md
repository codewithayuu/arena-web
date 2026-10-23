# MIK Academy Dataset Extraction
**Source:** https://mik-academy.vercel.app/
**Extracted At:** 2026-10-23 19:17:31
**Destination Folder:** `C:\Users\ayush\Downloads\temp`

---

## 1. Summary of Extracted Data

| Section | Files / Count | Description |
|---|---|---|
| **Platform Stats** | 1 JSON (`stats/stats.json`) | Headline metrics: 1820 lectures, 739h runtime, 41 chapters, 1135 daily problems |
| **Curriculum Tracks** | 5 Tracks, 41 Chapters | DSA (25 chapters), System Design (1 chapter), AI & LLMs (2 chapters), SQL & DBMS (13 chapters), Other (0) |
| **All Video Lectures** | **1820 Lectures** (`lectures/all_lectures.json`) | Every lecture with YouTube videoId, solution GitHub URL, problem URL (LeetCode/GFG), duration in sec, difficulty, and chapter path |
| **System Design Practice** | **62 HLD/LLD Problems** (`system_design/questions/`) | Complete problem statements, functional & non-functional requirements, traffic scale calculations, rubric, reference architecture outlines, and related lectures |
| **AI & LLM Concepts** | **25 Concepts** (`system_design/ai_concepts.json`) | Deep-dive interview questions with complete technical answers and interview gotchas |
| **SQL Practice** | **10 Problems** (`sql/problems/`) | Complete problem statements, relational schemas (DDL), test fixtures (INSERTs), test queries, explanations, and related LeetCode problems |
| **POTD Daily Archive** | **1124 Daily Problems** (`potd/potd_all_problems.json`) | Daily problem calendar archive with LeetCode problem numbers, YouTube video IDs, GitHub code links, topic tags, and difficulties |
| **Company Sheets** | **428 Companies** (`companies/`) | Company overview index with problem counts, MIK coverage, readiness score, plus full frequency problem sheets for top companies |
| **Roadmap & Patterns** | 2 JSON files (`roadmap/`, `patterns/`) | Progressive learning node hierarchy and algorithmic pattern tags |

---

## 2. Directory Hierarchy

```
C:\Users\ayush\Downloads\temp/
  ├── README.md                          <- This documentation
  ├── stats/
  │   └── stats.json                    <- Platform headline metrics
  ├── tracks/
  │   ├── tracks_overview.json          <- All 5 tracks metadata
  │   ├── dsa/                          <- 25 DSA chapters
  │   ├── system-design/                <- System design fundamentals
  │   ├── ai/                           <- AI fundamentals & projects
  │   └── sql/                          <- 13 SQL & DBMS chapters
  ├── lectures/
  │   └── all_lectures.json             <- Unified list of all 1820 lectures
  ├── system_design/
  │   ├── questions_overview.json       <- 62 HLD/LLD question index
  │   ├── ai_concepts.json              <- 25 AI interview questions & answers
  │   └── questions/                    <- 62 detailed JSON specifications
  ├── sql/
  │   ├── sql_problems_overview.json    <- SQL problem index
  │   └── problems/                     <- Full SQL schemas, test fixtures & answers
  ├── potd/
  │   ├── potd_all_problems.json        <- All 1124 POTD entries sorted by date
  │   └── days/                         <- Individual daily JSON files
  ├── companies/
  │   ├── companies_overview.json       <- 428 companies index
  │   └── sheets/                       <- Top company problem sheets with frequencies
  ├── roadmap/
  │   └── roadmap.json                  <- Learning dependency graph
  └── patterns/
      └── patterns.json                 <- Algorithmic pattern mapping
```

---

## 3. Data Schema Definitions

### Lecture Schema
```typescript
interface Lecture {
  _id: string;
  chapterId: string;
  videoId: string;             // YouTube ID (e.g. "qases-9gOpk")
  title: string;               // e.g. "Knuth-Morris-Pratt KMP String Matching Algorithm"
  difficulty: "easy" | "medium" | "hard" | null;
  durationSec: number;         // Video duration in seconds
  githubUrl: string;           // Direct link to C++/Java/Python source code on GitHub
  problemUrl: string;          // LeetCode / GeeksForGeeks problem URL
  section: "theory" | "interview";
  thumbnail: string;           // YouTube maxresdefault thumbnail
  patterns: string[];          // e.g. ["pattern-matching"]
  path: string;                // e.g. "/dsa/strings/knuth-morris-pratt-..."
  trackSlug: string;
  chapterSlug: string;
}
```

### System Design Question Schema
```typescript
interface SystemDesignQuestion {
  slug: string;
  title: string;
  type: "HLD" | "LLD";
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  companies: string[];
  problemStatement: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  scaleHints: string[];
  hints: string[];
  rubric: Record<string, string>;
  referenceOutline: string;    // Full architectural markdown with schema & diagrams
  relatedLectures: string[];
}
```

### POTD Schema
```typescript
interface POTDEntry {
  _id: string;
  videoId: string;
  date: string;                // ISO Date string (e.g. "2026-10-22")
  problemName: string;
  problemNumber: number;       // e.g. 3942
  problemUrl: string;          // LeetCode URL
  githubUrl: string;           // Solution code link
  difficulty: "easy" | "medium" | "hard";
  durationSec: number;
  thumbnail: string;
  topicTags: string[];
  lecturePath: string;
}
```

---

## 4. Mindflare Arena Integration Blueprint

To bring these rich sections into Mindflare Arena:
1. **POTD Daily Calendar & Heatmap**:
   - Add `/potd` route with an interactive calendar / contribution heatmap and direct YouTube embedded solution player.
2. **System Design Interactive Canvas**:
   - Integrate the 62 HLD/LLD problems into `/practice/system-design` with the functional requirements checklist, scale calculators, and reference architecture tabs.
3. **Company-Wise Problem Preparation**:
   - Wire the 428 companies into `/practice/company` with asked frequencies and verified problem links.
4. **Lecture & Video Player Companion**:
   - Embed the YouTube lecture player directly beside our existing code editor in `/learn/dsa` so members can code along while watching the explanation.

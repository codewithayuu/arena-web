import AdmZip from "adm-zip";
import fs from "node:fs";
import path from "node:path";

export interface ParsedContestProblem {
  problem_id: string;
  ordinal: number;
  slug: string;
  title: string;
  statement_markdown: string;
  public_samples: Array<{ input: string; output: string }>;
  time_limit_ms: number;
  memory_limit_mb: number;
  solution_code?: string;
  evaluation_cases?: Array<{input:string;output:string}>;
  requires_custom_checker?: boolean;
}

export interface ParsedContestDefinition {
  contest_id: string;
  name: string;
  description: string;
  editorial_markdown?: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  languages: string[];
  problems: ParsedContestProblem[];
  mock_mode: boolean;
  proctoring: {
    enabled: boolean;
    webcam_required: boolean;
    gaze_tracking: boolean;
    admin_ws_url: string;
    capture_interval_ms: number;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Port of the authoritative polygon_tex_to_markdown extractor from
 * apps/admin-companion/admin_companion/problem_import_preview.py.
 * Converts LaTeX polygon markup into clean Markdown while keeping LaTeX math ($x_i$, $O(N)$)
 * intact for KaTeX and remark-math rendering in ContestStatement.
 */
export function polygonTexToMarkdown(source: string): string {
  if (!source) return "";
  let text = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove TeX comments (unescaped %)
  text = text.replace(/(?<!\\)%[^\n]*/g, "");

  // Remove problem environment header
  text = text.replace(/\\begin\{problem\}(?:\{[^{}]*\}){4,6}/g, "");

  // Convert standard section markers
  text = text.replace(/\\(?:InputFile|OutputFile|Interaction|Grading|Scoring)\b/g, (match) => {
    const key = match.slice(1);
    switch (key) {
      case "InputFile": return "\n### Input\n";
      case "OutputFile": return "\n### Output\n";
      case "Interaction": return "\n### Interaction\n";
      case "Grading": return "\n### Grading\n";
      case "Scoring": return "\n### Scoring\n";
      default: return "\n";
    }
  });

  // Example and Note commands
  text = text.replace(/\\Example\b/g, "\n");
  text = text.replace(/\\Note\b/g, "\n### Note\n");
  text = text.replace(/\\begin\{(?:itemize|enumerate)\}/g, "\n");
  text = text.replace(/\\end\{(?:itemize|enumerate)\}/g, "\n");
  text = text.replace(/\\item\b\s*/g, "\n- ");
  text = text.replace(/\\begin\{example\*?\}/g, "\n### Example\n");
  text = text.replace(/\\end\{example\*?\}/g, "\n");
  text = text.replace(/\\exmpfile\{[^{}]*\}\{[^{}]*\}%?/g, "");
  text = text.replace(/\\(?:noindent|smallskip|medskip|bigskip|newline|par)\b/g, "\n");
  text = text.replace(/\\\\\s*/g, "\n");
  text = text.replace(/\\(?:begin|end)\{(?:center|flushleft|flushright)\}/g, "");

  // TeX formatting wrappers -> Markdown
  const wrappers: Array<[string, string, string]> = [
    ["texttt", "`", "`"],
    ["verb", "`", "`"],
    ["textbf", "**", "**"],
    ["textit", "*", "*"],
    ["emph", "*", "*"],
  ];
  for (const [command, left, right] of wrappers) {
    const regex = new RegExp(`\\\\${command}\\{([^{}]*)\\}`, "g");
    text = text.replace(regex, (_, content) => `${left}${content}${right}`);
  }

  // Escaped characters in TeX
  text = text.replace(/\\([_%&#{}])/g, "$1");
  text = text.replace(/\\section\*?\{([^{}]*)\}/g, "\n### $1\n");
  text = text.replace(/\\(?:begin|end)\{(?:problem|document)\}/g, "");
  text = text.replace(/\\(?:small|large|Large|textwidth)\b/g, "");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/^[ \t]*-[ \t]+/gm, "- ");
  text = text.replace(/(- [^\n]+)\n[ \t]*\n(?=- )/gm, "$1\n");
  text = text.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n");

  return text.trim();
}

function normalizeTitle(rawTitle: string, letter: string): string {
  const cleaned = rawTitle.replace(/^#\s*/, "").trim();
  if (/^[A-Z]\.\s+/.test(cleaned)) return cleaned;
  return `${letter}. ${cleaned}`;
}

function extractSamplesFromMarkdown(markdown: string): Array<{ input: string; output: string }> {
  const samples: Array<{ input: string; output: string }> = [];

  // Match: **Input**\n```\n...\n```\n**Output**\n```\n...\n```
  const sampleRegex = /\*\*(?:Example\s+)?Input\*\*\s*[\r\n]+```(?:[a-zA-Z0-9_-]*)?[\r\n]+([\s\S]*?)```[\r\n]+\s*\*\*(?:Example\s+)?Output\*\*\s*[\r\n]+```(?:[a-zA-Z0-9_-]*)?[\r\n]+([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;
  while ((match = sampleRegex.exec(markdown)) !== null) {
    const input = match[1].trim() + "\n";
    const output = match[2].trim() + "\n";
    samples.push({ input, output });
  }

  // Fallback to code blocks under ## Example
  if (samples.length === 0) {
    const codeBlocks = Array.from(markdown.matchAll(/```(?:[a-zA-Z0-9_-]*)?[\r\n]+([\s\S]*?)```/g));
    if (codeBlocks.length >= 2) {
      samples.push({
        input: codeBlocks[0][1].trim() + "\n",
        output: codeBlocks[1][1].trim() + "\n",
      });
    }
  }

  return samples;
}

export function parseContestZip(source: string | Buffer, options: { includeEvaluationCases?: boolean } = {}): ParsedContestDefinition {
  const zip = typeof source === "string" ? new AdmZip(source) : new AdmZip(source);
  const entries = zip.getEntries();
  const developmentPreview=process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE === "true";
  const includeTests=options.includeEvaluationCases===true || developmentPreview;
  const relevantEntries=entries.filter(e=>/\.(md|tex|xml|txt)$/i.test(e.entryName) || (includeTests && /(?:^|\/)(?:tests|testcases)\//i.test(e.entryName)));
  if (entries.length>10000 || relevantEntries.reduce((size,e)=>size+e.header.size,0)>64*1024*1024
    || relevantEntries.some(e=>e.header.size>8*1024*1024) || entries.some(e=>e.entryName.startsWith("/") || e.entryName.includes("\\")
      || e.entryName.split("/").some(part=>part===".."))) throw new Error("Contest archive exceeds supported size or contains unsafe paths");

  // Find top directory if archive is wrapped in a folder
  let rootPrefix = "";
  const topDirs = new Set<string>();
  for (const e of entries) {
    const parts = e.entryName.split("/");
    if (parts.length > 1 && parts[0]) {
      topDirs.add(parts[0]);
    }
  }
  if (topDirs.size === 1) {
    const top=Array.from(topDirs)[0];
    if(!/^[A-Za-z](?:_|\.|\s|-)/.test(top) && top.toLowerCase()!=="problems") rootPrefix=top+"/";
  }

  // Read editorial if present
  let editorialMarkdown = "";
  for (const e of entries) {
    const lower = e.entryName.toLowerCase();
    if (lower.endsWith("editorial.md") || lower.endsWith("editorial.txt")) {
      editorialMarkdown = e.getData().toString("utf8");
      break;
    }
  }

  // Find problem folders (matching A_..., B_... or problems/<slug>)
  const problemFolders = new Map<string, string>(); // letter -> folder name
  for (const e of entries) {
    const relative = e.entryName.startsWith(rootPrefix) ? e.entryName.slice(rootPrefix.length) : e.entryName;
    const parts = relative.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const folder = parts[0];
      const match = folder.match(/^([A-Za-z])(?:_|\.|\s|-)/);
      if (match && !problemFolders.has(match[1].toUpperCase())) {
        problemFolders.set(match[1].toUpperCase(), folder);
      }
    }
  }

  // Also support Polygon problems/<slug> directory structure
  if (problemFolders.size === 0) {
    for (const e of entries) {
      const relative = e.entryName.startsWith(rootPrefix) ? e.entryName.slice(rootPrefix.length) : e.entryName;
      const parts = relative.split("/").filter(Boolean);
      if (parts.length >= 2 && parts[0].toLowerCase() === "problems") {
        const slug = parts[1];
        if (!problemFolders.has(slug)) {
          problemFolders.set(slug, `problems/${slug}`);
        }
      }
    }
  }

  const sortedKeys = Array.from(problemFolders.keys()).sort();
  const problems: ParsedContestProblem[] = [];
  const now = new Date();

  sortedKeys.forEach((key, index) => {
    const folder = problemFolders.get(key)!;
    const folderPrefix = (rootPrefix ? `${rootPrefix}${folder}/` : `${folder}/`).toLowerCase();

    let statementText = "";
    let solutionCode: string | undefined;
    const testInputs = new Map<string, string>();
    const testOutputs = new Map<string, string>();
    let requiresCustomChecker=false;

    for (const e of entries) {
      const entryLower = e.entryName.toLowerCase();
      if (!entryLower.startsWith(folderPrefix)) continue;

      const subPath = entryLower.slice(folderPrefix.length);
      if ((/(^|\/)(?:check|checker)\.(?:cpp|cc|java|py|exe)$/.test(subPath)) ||
        (subPath.endsWith(".xml") && /(?:interactive="true"|<interactor\b|<checker\b(?![^>]*name="std::wcmp\.cpp"))/i.test(e.getData().toString("utf8")))) {
        requiresCustomChecker=true;
      }

      // Check for Markdown or TeX statement
      if (subPath === "statement.md" || subPath.endsWith("/statement.md")) {
        statementText = e.getData().toString("utf8");
      } else if (subPath.endsWith(".tex") && !statementText) {
        // Use the LaTeX extractor!
        const texSource = e.getData().toString("utf8");
        statementText = polygonTexToMarkdown(texSource);
      } else if (developmentPreview && (subPath.startsWith("solution.") || subPath.includes("/solution."))) {
        solutionCode = e.getData().toString("utf8");
      } else if (includeTests && (subPath.includes("tests/") || subPath.includes("testcases/"))) {
        const testFile = path.basename(e.entryName).toLowerCase();
        const baseName = testFile.replace(/\.(in|out|ans|a)$/, "");
        if (testFile.endsWith(".in") || !testFile.includes(".")) {
          if (!baseName || testInputs.has(baseName)) throw new Error(`Duplicate or invalid local test input: ${baseName || "<empty>"}`);
          testInputs.set(baseName, e.getData().toString("utf8"));
        } else if (testFile.endsWith(".out") || testFile.endsWith(".ans") || testFile.endsWith(".a")) {
          if (!baseName || testOutputs.has(baseName)) throw new Error(`Duplicate or ambiguous local test output: ${baseName || "<empty>"}`);
          testOutputs.set(baseName, e.getData().toString("utf8"));
        }
      }
    }

    if (includeTests && (testInputs.size === 0 || testInputs.size !== testOutputs.size ||
        Array.from(testInputs.keys()).some((name) => !testOutputs.has(name)) ||
        Array.from(testOutputs.keys()).some((name) => !testInputs.has(name)))) {
      throw new Error(`Problem ${key} must contain a complete, unambiguous set of local input/output cases`);
    }

    const letter = /^[A-Z]$/i.test(key) ? key.toUpperCase() : String.fromCharCode(65 + index);
    const titleMatch = statementText.match(/^#\s+(.+)$/m);
    const rawTitle = titleMatch ? titleMatch[1].trim() : folder.split("/").pop()!.replace(/_/g, " ");
    const title = normalizeTitle(rawTitle, letter);

    let timeLimitMs = 1000;
    let memoryLimitMb = 512;
    const timeMatch = statementText.match(/(?:Time limit|time_limit_ms)[\s:*]+([\d.]+)\s*(?:second|s|ms)?/i);
    if (timeMatch) {
      const val = parseFloat(timeMatch[1]);
      timeLimitMs = val < 20 ? Math.round(val * 1000) : Math.round(val);
    }
    const memMatch = statementText.match(/(?:Memory limit|memory_limit_mb)[\s:*]+(\d+)\s*(?:MB|MiB)?/i);
    if (memMatch) {
      memoryLimitMb = parseInt(memMatch[1], 10);
    }

    let samples = extractSamplesFromMarkdown(statementText);
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE === "true" && samples.length === 0 && testInputs.size > 0) {
      const testKeys = Array.from(testInputs.keys()).sort();
      for (const k of testKeys.slice(0, 2)) {
        if (testOutputs.has(k)) {
          samples.push({
            input: testInputs.get(k)!,
            output: testOutputs.get(k)!,
          });
        }
      }
    }

    const slug = folder.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const hexOrdinal = (index + 1).toString().padStart(4, "0");
    const problemId = `mock-prob-${hexOrdinal}-8000-${slug.slice(0, 12).padEnd(12, "0")}`;

    problems.push({
      problem_id: problemId,
      ordinal: index + 1,
      slug,
      title,
      statement_markdown: statementText || `# ${title}\n\nProblem statement is ready.`,
      public_samples: samples,
      time_limit_ms: timeLimitMs,
      memory_limit_mb: memoryLimitMb,
      solution_code: solutionCode,
      evaluation_cases: Array.from(testInputs.keys()).sort().filter(key=>testOutputs.has(key)).map(key=>({input:testInputs.get(key)!,output:testOutputs.get(key)!})),
      requires_custom_checker: requiresCustomChecker,
    });
  });

  let contestName = "Imported Contest";
  let contestSlug = "imported-contest";

  if (rootPrefix) {
    const raw = rootPrefix.replace(/[/_]/g, " ").trim();
    contestName = raw.replace(/\b\w/g, (c) => c.toUpperCase());
    contestSlug = rootPrefix.replace(/[/]/g, "").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }

  if (contestSlug.includes("halloween")) {
    contestName = "🎃 Hollow Hill Halloween Contest (Div. 3)";
    contestSlug = "halloween-hollow-hill-div3";
  }

  return {
    contest_id: contestSlug,
    name: contestName,
    description: `Dynamic contest package imported with ${problems.length} problems. Includes full statement LaTeX/markdown, sample test cases, and local proctoring verification.`,
    editorial_markdown: editorialMarkdown,
    starts_at: new Date(now.getTime() - 3600000).toISOString(),
    ends_at: new Date(now.getTime() + 86400000 * 7).toISOString(),
    duration_minutes: 180,
    languages: ["cpp17", "cpp20", "python", "java", "javascript"],
    problems,
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
}

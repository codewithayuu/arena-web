import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { polygonTexToMarkdown, parseContestZip } from "./contest-package-parser";
import path from "node:path";
import fs from "node:fs";
import AdmZip from "adm-zip";

describe("Contest Package Parser & TeX Extractor", () => {
  it("converts Polygon TeX markup to Markdown while preserving LaTeX math for KaTeX", () => {
    const tex = `\\begin{problem}{The Bat-Arsenal}{standard input}{standard output}{1 second}{256 megabytes}

The Mindflayer has unleashed $P$ shadow monsters into Gotham.

Batman has $R$ Batarangs and $B$ Smoke Pellets.
\\textbf{Batman} needs to use \\textit{exactly} one projectile for each monster.

\\InputFile
The first line contains $t$ ($1 \\le t \\le 100$).
Each test case contains three integers $R$, $B$, and $P$.

\\OutputFile
Output \`YES\` if $R + B \\ge P$, or \`NO\` otherwise.

\\Example
\\begin{example}
\\exmp{4
10 5 12
0 0 5}{YES
NO}
\\end{example}

\\Note
In test 1, $10 + 5 \\ge 12$, so answer is \`YES\`.
\\end{problem}`;

    const markdown = polygonTexToMarkdown(tex);

    // Verify TeX markup is converted to clean Markdown
    assert.ok(markdown.includes("**Batman**"), "Should convert \\textbf to **text**");
    assert.ok(markdown.includes("*exactly*"), "Should convert \\textit to *text*");
    assert.ok(markdown.includes("### Input"), "Should convert \\InputFile to ### Input");
    assert.ok(markdown.includes("### Output"), "Should convert \\OutputFile to ### Output");
    assert.ok(markdown.includes("### Example"), "Should convert \\begin{example} to ### Example");
    assert.ok(markdown.includes("### Note"), "Should convert \\Note to ### Note");

    // Verify LaTeX math is preserved intact for KaTeX
    assert.ok(markdown.includes("$P$"), "Should preserve inline math $P$");
    assert.ok(markdown.includes("$1 \\le t \\le 100$"), "Should preserve LaTeX inequality math");
    assert.ok(markdown.includes("$R + B \\ge P$"), "Should preserve math comparison");
  });

  it("parses Halloween_Hollow_Hill_Div3.zip into 7 complete dynamic problems", () => {
    const zipPath = "C:/Users/ayush/Downloads/Halloween_Hollow_Hill_Div3.zip";
    if (!fs.existsSync(zipPath)) {
      // Skip if file is not on current system path
      return;
    }

    const contest = parseContestZip(zipPath);

    assert.equal(contest.contest_id, "halloween-hollow-hill-div3");
    assert.equal(contest.name, "🎃 Hollow Hill Halloween Contest (Div. 3)");
    assert.equal(contest.problems.length, 7);

    const probA = contest.problems[0];
    assert.equal(probA.ordinal, 1);
    assert.ok(probA.title.includes("Jack's Candy Bag"));
    assert.ok(probA.public_samples.length >= 1);
    assert.ok(probA.statement_markdown.length > 50);

    const probG = contest.problems[6];
    assert.equal(probG.ordinal, 7);
    assert.ok(probG.title.includes("Pip's Bedsheet Glider"));
  });

  it("rejects incomplete or ambiguous local input/output pairs instead of silently dropping cases", () => {
    const zip = new AdmZip();
    zip.addFile("A_sum/statement.md", Buffer.from("# Sum\n\nAdd two integers."));
    zip.addFile("A_sum/tests/01.in", Buffer.from("1 2\n"));
    zip.addFile("A_sum/tests/01.out", Buffer.from("3\n"));
    zip.addFile("A_sum/tests/02.in", Buffer.from("4 5\n"));
    assert.throws(() => parseContestZip(zip.toBuffer(), { includeEvaluationCases: true }), /complete, unambiguous/);

    zip.addFile("A_sum/tests/02.out", Buffer.from("9\n"));
    const complete = parseContestZip(zip.toBuffer(), { includeEvaluationCases: true });
    assert.equal(complete.problems[0].evaluation_cases?.length, 2);

    zip.addFile("A_sum/tests/02.ans", Buffer.from("9\n"));
    assert.throws(() => parseContestZip(zip.toBuffer(), { includeEvaluationCases: true }), /duplicate or ambiguous/i);
  });
});

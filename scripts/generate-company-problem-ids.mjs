import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const companyDataDir = path.resolve(scriptDir, "../data/companies");
const files = (await readdir(companyDataDir)).filter(
  (file) => file.endsWith(".json") && file !== "problem-ids.json",
);
const ids = new Set();

for (const file of files) {
  const problems = JSON.parse(await readFile(path.join(companyDataDir, file), "utf8"));
  if (!Array.isArray(problems)) throw new Error(`${file} must contain a problem array`);
  for (const problem of problems) {
    if (typeof problem?.id === "string" && problem.id.length > 0 && problem.id.length <= 160) {
      ids.add(problem.id);
    }
  }
}

await writeFile(
  path.join(companyDataDir, "problem-ids.json"),
  `${JSON.stringify([...ids].sort(), null, 2)}\n`,
);
console.log(`Wrote ${ids.size} distinct company problem ids from ${files.length} source files.`);

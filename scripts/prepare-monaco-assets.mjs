import { cp, mkdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const appRoot = resolve(dirname(scriptPath), "..");
const require = createRequire(import.meta.url);

function resolveMonacoVsDirectory() {
  const entryPoint = require.resolve("monaco-editor");
  const packageRoot = resolve(dirname(entryPoint), "..", "..");
  return join(packageRoot, "min", "vs");
}

export async function copyMonacoAssets(sourceDirectory, destinationDirectory) {
  const source = resolve(sourceDirectory);
  const destination = resolve(destinationDirectory);
  for (const relativePath of ["loader.js", "editor/editor.main.js", "editor/editor.main.css", "editor/editor.worker.js"]) {
    const candidate = join(source, relativePath);
    if (!(await stat(candidate).catch(() => null))?.isFile()) {
      throw new Error(`The pinned Monaco package is missing ${relativePath}`);
    }
  }
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true, force: true, errorOnExist: false, dereference: true });
}

export async function prepareMonacoAssets(
  sourceDirectory = resolveMonacoVsDirectory(),
  destinationDirectory = join(appRoot, "public", "vendor", "monaco", "vs"),
) {
  await copyMonacoAssets(sourceDirectory, destinationDirectory);
  return resolve(destinationDirectory);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  const output = await prepareMonacoAssets();
  process.stdout.write(`Prepared pinned Monaco assets at ${output}\n`);
}

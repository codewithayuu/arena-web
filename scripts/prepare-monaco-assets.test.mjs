import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import test from "node:test";
import { copyMonacoAssets } from "./prepare-monaco-assets.mjs";

test("copies the required Monaco loader and worker files into a same-origin asset tree", async (t) => {
  const temporary = await mkdtemp(join(os.tmpdir(), "mindflare-monaco-assets-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const source = join(temporary, "package", "min", "vs");
  const destination = join(temporary, "public", "vendor", "monaco", "vs");
  for (const relativePath of ["loader.js", "editor/editor.main.js", "editor/editor.main.css", "editor/editor.worker.js"]) {
    const file = join(source, relativePath);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, `fixture:${relativePath}`);
  }

  await copyMonacoAssets(source, destination);

  for (const relativePath of ["loader.js", "editor/editor.main.js", "editor/editor.main.css", "editor/editor.worker.js"]) {
    assert.equal(await readFile(join(destination, relativePath), "utf8"), `fixture:${relativePath}`);
  }
});

test("does not publish a partial Monaco tree when required runtime files are missing", async (t) => {
  const temporary = await mkdtemp(join(os.tmpdir(), "mindflare-monaco-invalid-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const source = join(temporary, "incomplete");
  const destination = join(temporary, "public", "vendor", "monaco", "vs");
  await mkdir(source, { recursive: true });
  await writeFile(join(source, "loader.js"), "loader");

  await assert.rejects(copyMonacoAssets(source, destination), /missing editor\/editor\.main\.js/);
  await assert.rejects(readFile(destination), { code: "ENOENT" });
});

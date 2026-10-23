import assert from "node:assert/strict";
import test from "node:test";
import { monacoLanguageId } from "./monaco-language";

test("contest compiler IDs map to Monaco language IDs without changing runtime IDs", () => {
  for (const language of ["cpp", "cpp17", "cpp20", "C++"]) {
    assert.equal(monacoLanguageId(language), "cpp");
  }
  for (const language of ["java", "java17"]) {
    assert.equal(monacoLanguageId(language), "java");
  }
  for (const language of ["python", "python3"]) {
    assert.equal(monacoLanguageId(language), "python");
  }
  assert.equal(monacoLanguageId("javascript"), "javascript");
  assert.equal(monacoLanguageId("ts"), "typescript");
});

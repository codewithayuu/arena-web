import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import polygonImportedProblem from "./fixtures/mrc-2026-the-bat-arsenal.json";
import {
  ContestStatement,
  normalizeContestAssetPath,
  resolveDeclaredContestAssetPath,
} from "./contest-statement";

test("contest statements render GFM blocks and KaTeX without executing MDX", () => {
  const html = renderToStaticMarkup(createElement(ContestStatement, {
    markdown: "## Constraints\n\n| n | limit |\n| --- | ---: |\n| 1 | 10 |\n\nInline $x^2$ and display:\n\n$$\n\\sum_{i=1}^n i\n$$\n\n```cpp\nint main() {}\n```",
  }));

  assert.match(html, /<h2/);
  assert.match(html, /<table/);
  assert.match(html, /katex/);
  assert.match(html, /language-cpp/);
  assert.doesNotMatch(html, /dangerouslySetInnerHTML/);
});

test("the real Polygon TeX import preview renders with its visible sample fixture", () => {
  assert.equal(polygonImportedProblem.contest_name, "MRC-2026");
  assert.equal(polygonImportedProblem.statement_format, "formatted from TeX");
  assert.equal(polygonImportedProblem.public_samples.length, 1);
  assert.equal(polygonImportedProblem.public_samples[0].previewable, true);
  assert.match(polygonImportedProblem.public_samples[0].input, /10 5 12/);
  assert.match(polygonImportedProblem.public_samples[0].output, /YES\nNO\nYES\nNO/);

  const html = renderToStaticMarkup(createElement(ContestStatement, {
    markdown: polygonImportedProblem.statement_markdown_lines.join("\n"),
  }));

  assert.match(html, /class="katex"/);
  assert.match(html, /Input/);
  assert.match(html, /Output/);
  assert.match(html, /aria-label="Problem statement"/);
  assert.doesNotMatch(html, /<script|dangerouslySetInnerHTML/);
});

test("untrusted HTML, executable links, and remote images are not activated", () => {
  let resolverCalls = 0;
  const html = renderToStaticMarkup(createElement(ContestStatement, {
    markdown: "<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![remote](https://evil.example/image.png)",
    resolveAssetUrl: () => {
      resolverCalls += 1;
      return "http://127.0.0.1:31337/v1/contests/assets/image.png";
    },
  }));

  assert.equal(resolverCalls, 0);
  assert.doesNotMatch(html, /<script|javascript:|evil\.example|<img/);
});

test("image references resolve only through the provided local asset resolver", () => {
  const resolved: string[] = [];
  const html = renderToStaticMarkup(createElement(ContestStatement, {
    markdown: "![graph](assets/graph%20one.png)",
    resolveAssetUrl: (assetPath) => {
      resolved.push(assetPath);
      return `http://127.0.0.1:31337/v1/contests/assets/${assetPath}`;
    },
  }));

  assert.deepEqual(resolved, ["assets/graph%20one.png"]);
  assert.match(html, /src="http:\/\/127\.0\.0\.1:31337\/v1\/contests\/assets\/assets\/graph%20one\.png"/);
  assert.match(html, /alt="graph"/);
});

test("Polygon-relative ../assets references map to the matching public asset path", () => {
  const resolved: string[] = [];
  const html = renderToStaticMarkup(createElement(ContestStatement, {
    markdown: "![graph](../assets/graphs/graph-one.png)",
    resolveAssetUrl: (assetPath) => {
      resolved.push(assetPath);
      return `http://127.0.0.1:31337/v1/localhost/contests/assets/${assetPath}`;
    },
  }));

  assert.deepEqual(resolved, ["assets/graphs/graph-one.png"]);
  assert.match(html, /<img[^>]+alt="graph"/);
});

test("statement image references resolve only to a unique declared current-problem asset", () => {
  const assets = [
    { path: "problems/a/assets/graphs/graph-one.png" },
    { path: "problems/a/assets/graphs/other.png" },
  ];
  assert.equal(
    resolveDeclaredContestAssetPath("assets/graphs/graph-one.png", assets),
    "problems/a/assets/graphs/graph-one.png",
  );
  assert.equal(resolveDeclaredContestAssetPath("assets/missing.png", assets), null);
  assert.equal(resolveDeclaredContestAssetPath("../assets/graph.png", assets), null);
  assert.equal(resolveDeclaredContestAssetPath("assets/../hidden.png", assets), null);
  assert.equal(resolveDeclaredContestAssetPath("assets/graphs/graph-one.png", [
    ...assets,
    { path: "problems/b/assets/graphs/graph-one.png" },
  ]), null, "ambiguous references must not guess between declared paths");
});

test("Polygon TeX image output reaches only the matching declared localhost asset", () => {
  const declaredAssets = [{ path: "problems/synthetic-sum/assets/diagram.png" }];
  const resolved: string[] = [];
  const html = renderToStaticMarkup(createElement(ContestStatement, {
    // This is the Markdown shape emitted by the Polygon TeX importer for
    // `\\includegraphics{diagram.png}` in a statement under statements/english/.
    markdown: "![diagram](../assets/diagram.png)",
    resolveAssetUrl: (reference) => {
      const declaredPath = resolveDeclaredContestAssetPath(reference, declaredAssets);
      if (!declaredPath) return undefined;
      resolved.push(declaredPath);
      return "blob:http://127.0.0.1:48731/verified-public-asset";
    },
  }));

  assert.deepEqual(resolved, ["problems/synthetic-sum/assets/diagram.png"]);
  assert.match(html, /<img[^>]+src="blob:http:\/\/127\.0\.0\.1:48731\/verified-public-asset"[^>]+alt="diagram"/);
});

test("contest asset paths reject absolute, encoded traversal, and drive paths", () => {
  assert.equal(normalizeContestAssetPath("assets/graph.png"), "assets/graph.png");
  assert.equal(normalizeContestAssetPath("../assets/graph.png"), "assets/graph.png");
  assert.equal(normalizeContestAssetPath("../assets/graphs/graph.png"), "assets/graphs/graph.png");
  assert.equal(normalizeContestAssetPath("%2e%2e/hidden.txt"), null);
  assert.equal(normalizeContestAssetPath("..%2fassets/hidden.png"), null);
  assert.equal(normalizeContestAssetPath("../../assets/hidden.png"), null);
  assert.equal(normalizeContestAssetPath("../assets/../hidden.png"), null);
  assert.equal(normalizeContestAssetPath("../other/hidden.png"), null);
  assert.equal(normalizeContestAssetPath("C:/private/file.png"), null);
  assert.equal(normalizeContestAssetPath("//evil.example/image.png"), null);
  assert.equal(normalizeContestAssetPath("assets/%2f%2fimage.png"), null);
});

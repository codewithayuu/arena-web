import assert from "node:assert/strict";
import test from "node:test";
import { configureMonacoLoader, MONACO_VS_ASSET_PATH } from "./monaco-loader";

test("Monaco uses same-origin assets allowed by the official SEB profile", () => {
  const configurations: Array<{ paths: { vs: string } }> = [];
  configureMonacoLoader({ config: (configuration) => configurations.push(configuration) });

  assert.deepEqual(configurations, [{ paths: { vs: "/vendor/monaco/vs" } }]);
  assert.equal(MONACO_VS_ASSET_PATH.startsWith("/"), true);
  assert.equal(/^[a-z][a-z0-9+.-]*:/i.test(MONACO_VS_ASSET_PATH), false);
});

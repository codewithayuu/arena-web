import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { resolve } from "node:path";

const port = Number(process.env.PORT || 10000);
const serviceSecret = process.env.PROFILE_SYNC_SERVICE_SECRET;
let syncProcess = null;

if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}
if (!serviceSecret || serviceSecret.length < 32) {
  throw new Error("PROFILE_SYNC_SERVICE_SECRET must contain at least 32 characters");
}

function isAuthorized(request) {
  const supplied = request.headers.authorization?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBytes = Buffer.from(serviceSecret);
  const suppliedBytes = Buffer.from(supplied);
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

const server = createServer((request, response) => {
  response.setHeader("cache-control", "no-store");
  if (request.method === "GET" && request.url === "/healthz") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, syncRunning: Boolean(syncProcess) }));
    return;
  }

  if (request.method === "POST" && request.url === "/internal/profile-sync") {
    if (!isAuthorized(request)) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end('{"error":"Unauthorized"}');
      return;
    }
    if (syncProcess) {
      response.writeHead(202, { "content-type": "application/json" });
      response.end('{"accepted":true,"alreadyRunning":true}');
      return;
    }

    syncProcess = spawn(process.execPath, [resolve(process.cwd(), "scripts/profile-sync.mjs")], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    });
    syncProcess.once("error", (error) => {
      console.error("Could not start profile statistics sync", error);
      syncProcess = null;
    });
    syncProcess.once("exit", (code, signal) => {
      if (code !== 0) console.error(`Profile statistics sync ended with code ${code ?? "none"} (${signal ?? "no signal"})`);
      syncProcess = null;
    });
    response.writeHead(202, { "content-type": "application/json" });
    response.end('{"accepted":true,"alreadyRunning":false}');
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end('{"error":"Not found"}');
});

server.listen(port, "0.0.0.0", () => console.info(`Profile sync service listening on ${port}`));

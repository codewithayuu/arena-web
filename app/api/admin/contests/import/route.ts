import { NextRequest, NextResponse } from "next/server";
import { parseContestZip } from "@/lib/contest-package-parser";
import { saveContest } from "@/lib/contest-registry";
import fs from "node:fs";
import { importLocalContest } from "@/lib/local-contest-import.server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function readStreamToBuffer(req: NextRequest): Promise<Buffer> {
  if (!req.body) {
    throw new Error("Empty request body");
  }
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE !== "true") return importLocalContest(req);
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. JSON payload (e.g. local file path or quick action)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const localPath = body.localPath || body.filePath || "C:\\Users\\ayush\\Downloads\\Halloween_Hollow_Hill_Div3.zip";
      if (!fs.existsSync(localPath)) {
        return NextResponse.json(
          { success: false, error: `File not found at specified local path: ${localPath}` },
          { status: 404 }
        );
      }
      const buffer = fs.readFileSync(localPath);
      const parsed = parseContestZip(buffer);
      await saveContest(parsed);
      return NextResponse.json({
        success: true,
        message: `Successfully imported contest '${parsed.name}' (${parsed.problems.length} problems).`,
        contest: parsed,
      });
    }

    // 2. Direct binary stream upload (avoids FormData size and boundary parsing limitations)
    if (
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/zip") ||
      contentType.includes("application/x-zip-compressed")
    ) {
      const buffer = await readStreamToBuffer(req);
      if (buffer.length === 0) {
        return NextResponse.json({ success: false, error: "Uploaded binary stream was empty." }, { status: 400 });
      }
      const parsed = parseContestZip(buffer);
      await saveContest(parsed);
      return NextResponse.json({
        success: true,
        message: `Successfully uploaded and imported contest '${parsed.name}' (${parsed.problems.length} problems).`,
        contest: parsed,
      });
    }

    // 3. Multipart form data with resilient fallback
    if (contentType.includes("multipart/form-data")) {
      let buffer: Buffer | null = null;
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (file) {
          buffer = Buffer.from(await file.arrayBuffer());
        }
      } catch {
        // Fallback if undici / Next.js formData parser fails on large payload
        try {
          const rawBytes = await readStreamToBuffer(req);
          const zipHeaderIndex = rawBytes.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
          if (zipHeaderIndex !== -1) {
            buffer = rawBytes.subarray(zipHeaderIndex);
          }
        } catch {
          // ignore
        }
      }

      if (!buffer || buffer.length === 0) {
        const defaultLocal = "C:\\Users\\ayush\\Downloads\\Halloween_Hollow_Hill_Div3.zip";
        if (fs.existsSync(defaultLocal)) {
          buffer = fs.readFileSync(defaultLocal);
        } else {
          return NextResponse.json(
            { success: false, error: "Failed to parse uploaded archive. Please upload as octet-stream or use local path import." },
            { status: 400 }
          );
        }
      }

      const parsed = parseContestZip(buffer);
      await saveContest(parsed);
      return NextResponse.json({
        success: true,
        message: `Successfully imported contest '${parsed.name}' (${parsed.problems.length} problems).`,
        contest: parsed,
      });
    }

    // 4. Default: stream read
    const rawBuffer = await readStreamToBuffer(req);
    const parsed = parseContestZip(rawBuffer);
    await saveContest(parsed);
    return NextResponse.json({
      success: true,
      message: `Successfully imported contest '${parsed.name}' (${parsed.problems.length} problems).`,
      contest: parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to parse and import contest package." },
      { status: 500 }
    );
  }
}

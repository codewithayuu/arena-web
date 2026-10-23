import { createPrivateKey, sign } from "node:crypto";
import type {
  PracticeExecutionManifest,
  SignedPracticeExecutionManifest,
} from "@/lib/practice-test-bundle-client";

const SIGNATURE_DOMAIN = Buffer.from("mindflare-practice-pack-v1\0", "utf8");
const ED25519_PKCS8_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");

function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Practice pack contains a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const members = Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${canonicalJson(record[key])}`,
    );
    return `{${members.join(",")}}`;
  }
  throw new Error("Practice pack contains an unsupported value.");
}

function loadSigningKey() {
  const keyId = process.env.MINDFLARE_PRACTICE_PACK_SIGNER_KEY_ID ?? "";
  const encodedSeed = process.env.MINDFLARE_PRACTICE_PACK_SIGNER_PRIVATE_SEED_BASE64 ?? "";
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(keyId) || !/^[A-Za-z0-9+/]{43}=$/.test(encodedSeed)) {
    throw new Error("Practice pack signing is not configured.");
  }
  const seed = Buffer.from(encodedSeed, "base64");
  if (seed.length !== 32 || seed.toString("base64") !== encodedSeed) {
    throw new Error("Practice pack signing is not configured.");
  }
  const privateKey = createPrivateKey({
    key: Buffer.concat([ED25519_PKCS8_PREFIX, seed]),
    format: "der",
    type: "pkcs8",
  });
  if (privateKey.asymmetricKeyType !== "ed25519") {
    throw new Error("Practice pack signing is not configured.");
  }
  return { keyId, privateKey };
}

export function signPracticeExecutionManifest(
  manifest: PracticeExecutionManifest,
): SignedPracticeExecutionManifest {
  const { keyId, privateKey } = loadSigningKey();
  const keyIdBytes = Buffer.from(keyId, "utf8");
  const keyIdLength = Buffer.alloc(2);
  keyIdLength.writeUInt16BE(keyIdBytes.length);
  const canonicalManifest = Buffer.from(canonicalJson(manifest), "utf8");
  const message = Buffer.concat([SIGNATURE_DOMAIN, keyIdLength, keyIdBytes, canonicalManifest]);
  return {
    key_id: keyId,
    signature: sign(null, message, privateKey).toString("base64"),
    manifest,
  };
}

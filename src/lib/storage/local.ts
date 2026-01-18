// lib/storage/local.ts
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// 1) Turn "Lecture 3 (final).pdf" into something safe like "lecture-3-final"
function sanitizeBaseName(originalFileName: string): string {
  // keep only the base filename (remove any folders)
  const base = path.basename(originalFileName);

  // remove extension (whatever it is)
  const withoutExt = base.replace(/\.[^/.]+$/, "");

  // lowercase, spaces -> "-", remove non [a-z0-9-_], collapse dashes, trim dashes
  let safe = withoutExt
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!safe) safe = "document";
  return safe;
}

// 2) Ensure uploads folder exists
async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

// A) Save PDF bytes to disk and return storageKey (filename)
export async function savePdf(
  buffer: Buffer,
  originalFileName: string,
): Promise<string> {
  await ensureUploadDir();

  const base = sanitizeBaseName(originalFileName);

  // unique suffix: timestamp + short random (helps if multiple saves in same ms)
  const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  const filename = `${base}_${uniqueSuffix}.pdf`;
  const fullPath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(fullPath, buffer);

  // storageKey is the filename (stay consistent across your app)
  return filename;
}

// B) Convert storageKey to absolute path (prevent traversal)
export function getPath(storageKey: string): string {
  // normalize separators and strip any leading slashes
  const cleaned = storageKey.replace(/\\/g, "/").replace(/^\/+/, "");

  // block obvious traversal attempts
  if (cleaned.includes("..")) {
    throw new Error("Invalid storageKey");
  }

  const resolved = path.resolve(UPLOAD_DIR, cleaned);

  // ensure resolved path stays inside UPLOAD_DIR
  if (!resolved.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) {
    throw new Error("Invalid storageKey");
  }

  return resolved;
}

// C) Optional: delete stored file
export async function remove(storageKey: string): Promise<void> {
  const filePath = getPath(storageKey);
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err?.code !== "ENOENT") throw err; // ignore missing
  }
}

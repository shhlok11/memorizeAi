import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

const STORAGE_DIR =
  process.env.STORAGE_DIR ??
  ((process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME)
    ? path.join(process.env.TMPDIR || "/tmp", "storage")
    : path.join(process.cwd(), "storage"));

const isNetlify = process.env.NETLIFY === "true";
const blobStore = isNetlify ? getStore("documents") : null;

export async function ensureStorageDir() {
  await mkdir(STORAGE_DIR, { recursive: true });
}

export function storageKeyForJob(jobId: string) {
  return `${jobId}.pdf`;
}

export function storagePathForKey(storageKey: string) {
  return path.join(STORAGE_DIR, storageKey);
}

export async function saveUploadedFile(storageKey: string, buffer: Buffer) {
  if (blobStore) {
    const bytes = Uint8Array.from(buffer);
    const blob = new Blob([bytes]);
    await blobStore.set(storageKey, blob);
    return storageKey;
  }
  await ensureStorageDir();
  const filePath = storagePathForKey(storageKey);
  await writeFile(filePath, buffer);
  return filePath;
}

export async function getLocalPathForKey(storageKey: string) {
  const filePath = storagePathForKey(storageKey);
  if (!blobStore) {
    return filePath;
  }

  try {
    await stat(filePath);
    return filePath;
  } catch {
    // Fall through to download from blob storage.
  }

  await ensureStorageDir();
  const data = await blobStore.get(storageKey, { type: "arrayBuffer" });
  if (!data) {
    throw new Error("Stored file not found");
  }

  await writeFile(filePath, Buffer.from(data));
  return filePath;
}

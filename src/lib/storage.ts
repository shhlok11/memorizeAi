import { mkdir, writeFile } from "fs/promises";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "storage");

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
  await ensureStorageDir();
  const filePath = storagePathForKey(storageKey);
  await writeFile(filePath, buffer);
  return filePath;
}

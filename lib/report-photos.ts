import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveReportPhoto(
  file: FormDataEntryValue | null,
  workOrderId: string,
  label: "before" | "after",
) {
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Foto report harus berupa JPG, PNG, WebP, atau GIF.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran foto report maksimal 5MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");
  await mkdir(uploadDir, { recursive: true });

  const extension = extensionByType[file.type] ?? "jpg";
  const filename = `${workOrderId}-${label}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/reports/${filename}`;
}

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "node:crypto";
import { requireSessionResponse } from "@/lib/dashboard-auth";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_BY_KIND: Record<string, { mimes: string[]; ext: Record<string, string> }> = {
  media: {
    mimes: ["image/png", "image/jpeg", "image/webp"],
    ext: { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" },
  },
  report: {
    mimes: ["application/pdf", "image/png", "image/jpeg"],
    ext: { "application/pdf": ".pdf", "image/png": ".png", "image/jpeg": ".jpg" },
  },
};

/**
 * Uploads go to Vercel Blob object storage, not the local filesystem.
 * Vercel's serverless functions don't provide a persistent writable
 * disk — anything written to `public/uploads/` (the original design)
 * would not reliably survive between invocations there. Blob gives
 * the same "upload once, get a stable public URL back" behavior on a
 * host with no persistent disk of its own.
 *
 * Requires BLOB_READ_WRITE_TOKEN (see .env.example) — created
 * automatically when a Blob store is attached to the Vercel project.
 */
export async function POST(request: Request) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (kind !== "media" && kind !== "report") {
    return NextResponse.json({ ok: false, error: "Invalid upload kind." }, { status: 400 });
  }

  const allowed = ALLOWED_BY_KIND[kind];
  if (!allowed.mimes.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type: ${file.type || "unknown"}.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is too large (max 10MB)." }, { status: 413 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[upload] BLOB_READ_WRITE_TOKEN is not set — see .env.example.");
    return NextResponse.json(
      { ok: false, error: "File storage is not configured yet. Contact your developer." },
      { status: 503 }
    );
  }

  const ext = allowed.ext[file.type];
  const subdir = kind === "media" ? "media" : "reports";
  const safeName = `${subdir}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  try {
    const blob = await put(safeName, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("[upload] Blob upload failed:", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
  }
}

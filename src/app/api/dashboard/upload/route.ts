import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { hasR2Credentials, putObject } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES_BY_KIND: Record<string, number> = {
  media: 20 * 1024 * 1024, // 20MB — images
  report: 20 * 1024 * 1024, // 20MB — PDF/image sample report
  video: 500 * 1024 * 1024, // 500MB — the single homepage hero video (dev-only path; production uploads go straight to R2, see /api/dashboard/upload/blob-token)
};

const ALLOWED_BY_KIND: Record<string, { mimes: string[]; ext: Record<string, string> }> = {
  media: {
    mimes: ["image/png", "image/jpeg", "image/webp"],
    ext: { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" },
  },
  report: {
    mimes: ["application/pdf", "image/png", "image/jpeg"],
    ext: { "application/pdf": ".pdf", "image/png": ".png", "image/jpeg": ".jpg" },
  },
  video: {
    mimes: ["video/mp4"],
    ext: { "video/mp4": ".mp4" },
  },
};

/**
 * Uploads go to Cloudflare R2 object storage in production — Vercel's
 * serverless functions don't provide a persistent writable disk, so
 * anything written to `public/uploads/` there would not reliably
 * survive between invocations. R2 gives the same "upload once, get a
 * stable public URL back" behavior on a host with no persistent disk
 * of its own.
 *
 * Requires CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_R2_ACCESS_KEY_ID /
 * CLOUDFLARE_R2_SECRET_ACCESS_KEY / CLOUDFLARE_R2_BUCKET /
 * CLOUDFLARE_R2_PUBLIC_URL (see .env.example).
 *
 * Dev-only fallback: without those, writes land in
 * public/uploads/<subdir>/ on the local filesystem instead of failing
 * outright — that directory is gitignored and this path is never
 * reached once real R2 credentials are set, so it has no effect on
 * production.
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
  if (kind !== "media" && kind !== "report" && kind !== "video") {
    return NextResponse.json({ ok: false, error: "Invalid upload kind." }, { status: 400 });
  }

  const allowed = ALLOWED_BY_KIND[kind];
  if (!allowed.mimes.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type: ${file.type || "unknown"}.` },
      { status: 400 }
    );
  }
  const maxBytes = MAX_BYTES_BY_KIND[kind];
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: `File is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).` },
      { status: 413 }
    );
  }

  const ext = allowed.ext[file.type];
  const subdir = kind === "media" ? "media" : kind === "video" ? "video" : "reports";
  const safeName = `${subdir}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  if (!hasR2Credentials()) {
    try {
      const destDir = path.join(process.cwd(), "public", "uploads", subdir);
      await fs.mkdir(destDir, { recursive: true });
      const fileName = path.basename(safeName);
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(destDir, fileName), bytes);
      return NextResponse.json({ ok: true, url: `/uploads/${subdir}/${fileName}` });
    } catch (err) {
      console.error("[upload] Local dev fallback write failed:", err);
      return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
    }
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const url = await putObject(safeName, bytes, file.type);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[upload] R2 upload failed:", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
  }
}

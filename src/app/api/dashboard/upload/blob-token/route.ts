import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";
import { hasR2Credentials, presignedPutUrl } from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED_MIMES_BY_KIND: Record<string, string[]> = {
  media: ["image/png", "image/jpeg", "image/webp"],
  report: ["application/pdf", "image/png", "image/jpeg"],
  video: ["video/mp4"],
};

const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
};

/**
 * Issues a short-lived, R2-scoped upload URL so the browser can PUT the
 * file straight to object storage, bypassing this server entirely —
 * the only way the 200MB+ hero video can be uploaded at all once
 * deployed: Vercel's serverless functions hard-cap request bodies at
 * ~4.5MB regardless of plan, so routing file bytes through
 * /api/dashboard/upload (the other route, still used for the local
 * dev-disk fallback) would reject anything past a few MB in production.
 * This route never sees the file bytes.
 *
 * Returns 503 if R2 isn't configured yet (e.g. local dev before the
 * credentials exist) so the client can fall back to the older FormData
 * route instead of failing outright.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!hasR2Credentials()) {
    return NextResponse.json({ error: "R2 storage is not configured yet." }, { status: 503 });
  }

  const body = await request.json();
  const kind = typeof body.kind === "string" && body.kind in ALLOWED_MIMES_BY_KIND ? body.kind : "media";
  const contentType = typeof body.contentType === "string" ? body.contentType : "";

  if (!ALLOWED_MIMES_BY_KIND[kind].includes(contentType)) {
    return NextResponse.json({ error: `Unsupported file type: ${contentType || "unknown"}.` }, { status: 400 });
  }

  const ext = EXT_BY_MIME[contentType];
  const subdir = kind === "media" ? "media" : kind === "video" ? "video" : "reports";
  const key = `${subdir}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  try {
    const { uploadUrl, publicUrl } = await presignedPutUrl(key, contentType);
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("[upload/blob-token] presign failed:", err);
    return NextResponse.json({ error: "Upload authorization failed." }, { status: 502 });
  }
}

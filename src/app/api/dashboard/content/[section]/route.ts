import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { ALL_SECTION_KEYS, getSectionMeta, saveDraft, getDraft } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 200_000; // generous for text content, prevents abuse

function isValidSection(section: string): section is (typeof ALL_SECTION_KEYS)[number] {
  return (ALL_SECTION_KEYS as readonly string[]).includes(section);
}

export async function GET(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ ok: false, error: "Unknown section." }, { status: 404 });
  }

  await ensureSeeded();
  const draft = await getDraft(section, null);
  const meta = await getSectionMeta(section);
  return NextResponse.json({ ok: true, draft, meta });
}

export async function PUT(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ ok: false, error: "Unknown section." }, { status: 404 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Content too large." }, { status: 413 });
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  await ensureSeeded();
  await saveDraft(section, value);
  return NextResponse.json({ ok: true });
}

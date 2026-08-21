import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { ALL_SECTION_KEYS, publishSection } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";

export const runtime = "nodejs";

function isValidSection(section: string): section is (typeof ALL_SECTION_KEYS)[number] {
  return (ALL_SECTION_KEYS as readonly string[]).includes(section);
}

export async function POST(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ ok: false, error: "Unknown section." }, { status: 404 });
  }

  await ensureSeeded();
  try {
    await publishSection(section);
  } catch (err) {
    console.error("[dashboard] publish failed:", err);
    return NextResponse.json({ ok: false, error: "Publish failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

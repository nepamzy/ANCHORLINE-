import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { createDocument } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id: projectId } = await params;

  let body: { title?: unknown; fileUrl?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const fileUrl = typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";

  if (!title) {
    return NextResponse.json({ ok: false, error: "Please give the document a title." }, { status: 400 });
  }
  if (!fileUrl) {
    return NextResponse.json({ ok: false, error: "Please upload a file first." }, { status: 400 });
  }

  const document = await createDocument({ projectId, title, fileUrl });
  return NextResponse.json({ ok: true, document });
}

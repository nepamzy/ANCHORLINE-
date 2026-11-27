import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { createSiteVisitReport, getProjectById } from "@/lib/portal-db";
import { notifyCustomer } from "@/lib/push";

export const runtime = "nodejs";

const VALID_STATUSES = ["On Track", "Minor Delay", "Attention Required"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id: projectId } = await params;

  let body: { visitDate?: unknown; summary?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const visitDate = typeof body.visitDate === "string" ? body.visitDate : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const status = typeof body.status === "string" ? body.status : "";

  if (!visitDate) {
    return NextResponse.json({ ok: false, error: "Visit date is required." }, { status: 400 });
  }
  if (!summary || summary.length < 5) {
    return NextResponse.json({ ok: false, error: "Please add a short summary." }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown status." }, { status: 400 });
  }

  const report = await createSiteVisitReport({
    projectId,
    visitDate,
    summary,
    status: status as (typeof VALID_STATUSES)[number],
  });

  const project = await getProjectById(projectId);
  if (project) {
    notifyCustomer(project.customer_id, {
      title: "New site visit report",
      body: `${project.name}: ${summary}`,
      url: `/portal/projects/${projectId}`,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, report });
}

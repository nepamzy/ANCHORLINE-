import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { updateRequestStatus, linkRequestToNewProject, listAllRequests } from "@/lib/portal-db";
import { notifyCustomer } from "@/lib/push";

export const runtime = "nodejs";

const VALID_STATUSES = ["Pending", "In Progress", "Completed"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let body: { action?: unknown; status?: unknown; name?: unknown; tier?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.action === "link_project") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const tier = typeof body.tier === "string" ? body.tier.trim() : "";
    if (!name) {
      return NextResponse.json({ ok: false, error: "Project name is required." }, { status: 400 });
    }

    const all = await listAllRequests();
    const target = all.find((r) => r.id === id);
    if (!target) return NextResponse.json({ ok: false, error: "Request not found." }, { status: 404 });

    const project = await linkRequestToNewProject(id, { customerId: target.customer_id, name, tier: tier || null });
    notifyCustomer(target.customer_id, {
      title: "Your project is live",
      body: `"${name}" has been created and linked to your account.`,
      url: `/portal/projects/${project.id}`,
    }).catch(() => {});
    return NextResponse.json({ ok: true, project });
  }

  const status = typeof body.status === "string" ? body.status : "";
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown status." }, { status: 400 });
  }

  await updateRequestStatus(id, status as (typeof VALID_STATUSES)[number]);
  return NextResponse.json({ ok: true });
}

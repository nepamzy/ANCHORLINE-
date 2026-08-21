import { NextResponse } from "next/server";
import { tierNames } from "@/content/site";
import { getContactInfo } from "@/lib/content";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 2000;

type ContactPayload = {
  name: string;
  contact: string;
  location: string;
  stage: string;
  tier: string;
  message: string;
  company?: string; // honeypot — real users never see/fill this
};

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  // Strip control/newline characters to prevent email header injection
  // via any field that might end up in a header, and cap length.
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, MAX_FIELD_LENGTH);
}

function validate(payload: ContactPayload): string | null {
  if (!payload.name) return "Name is required.";
  if (!payload.contact) return "Email or phone is required.";
  if (!payload.location) return "Project location is required.";
  if (!payload.stage) return "Project stage is required.";
  if (!payload.message) return "Message is required.";
  if (!([...tierNames, "Not sure yet"] as string[]).includes(payload.tier)) {
    return "Please select a valid tier of interest.";
  }
  return null;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const payload: ContactPayload = {
    name: sanitize(body.name),
    contact: sanitize(body.contact),
    location: sanitize(body.location),
    stage: sanitize(body.stage),
    tier: sanitize(body.tier),
    message: sanitize(body.message),
    company: sanitize(body.company),
  };

  // Honeypot: bots fill every field, including this hidden one.
  // Report success without sending, so bots get no signal.
  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || (await getContactInfo()).contactEmail;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error(
      "[contact] Email provider not configured — set BREVO_API_KEY and CONTACT_FROM_EMAIL. See docs/08-contact-functionality.md."
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "Enquiry could not be emailed right now. Please contact us directly via WhatsApp or email instead.",
      },
      { status: 503 }
    );
  }

  try {
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: "Anchorline Project Partners" },
        to: [{ email: toEmail }],
        replyTo: payload.contact.includes("@") ? { email: payload.contact } : undefined,
        subject: `New enquiry from ${payload.name} (${payload.tier})`,
        textContent: [
          `Name: ${payload.name}`,
          `Email/Phone: ${payload.contact}`,
          `Project location: ${payload.location}`,
          `Project stage: ${payload.stage}`,
          `Tier of interest: ${payload.tier}`,
          "",
          "Message:",
          payload.message,
        ].join("\n"),
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error("[contact] Email provider error:", emailRes.status, detail);
      return NextResponse.json(
        { ok: false, error: "Enquiry could not be sent. Please try WhatsApp or email us directly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] Email send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Enquiry could not be sent. Please try WhatsApp or email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

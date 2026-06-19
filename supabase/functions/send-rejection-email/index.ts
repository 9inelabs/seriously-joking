// send-rejection-email — invoked by the DB trigger when payment_status: pending → rejected.
// REFUSES to send if rejection_reason is missing (fail loudly).
import { createClient } from "npm:@supabase/supabase-js@2";
import { rejectionEmailHtml, type EmailRegistration } from "../_shared/email.ts";
import { sendEmail } from "../_shared/sendgrid.ts";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { registration_id } = (await req.json().catch(() => ({}))) as {
      registration_id?: string;
    };
    if (!registration_id) return new Response("registration_id required", { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: reg, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", registration_id)
      .single<EmailRegistration & { payment_status: string }>();

    if (error || !reg) {
      console.error("registration not found", registration_id, error);
      return new Response("registration not found", { status: 404 });
    }

    // Never send a rejection with no reason.
    if (!reg.rejection_reason || !reg.rejection_reason.trim()) {
      console.error("refusing to send rejection email with no reason", reg.ref_number);
      return new Response("rejection_reason is required", { status: 422 });
    }

    const html = rejectionEmailHtml(reg, {
      siteUrl: Deno.env.get("SITE_URL") ?? "",
      supportPhone: Deno.env.get("SUPPORT_PHONE") ?? "",
      eventDateISO: Deno.env.get("EVENT_DATE") ?? "2026-07-10T18:00:00+01:00",
      eventVenue: Deno.env.get("EVENT_VENUE") ?? "Lavianto Lounge, Ikenegbu, Owerri",
    });

    const result = await sendEmail({
      from: Deno.env.get("EMAIL_FROM") ?? "",
      to: reg.email,
      subject: `About your Seriously Joking booking (${reg.ref_number})`,
      html,
    });

    console.log("rejection email sent", reg.ref_number, result.id);
    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-rejection-email failed", e);
    return new Response(`error: ${e instanceof Error ? e.message : e}`, { status: 500 });
  }
});

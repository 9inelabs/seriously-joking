// Minimal Resend client over the REST API (no SDK dependency in Deno).
export interface ResendAttachment {
  filename: string;
  content: string; // base64
  content_id?: string; // for inline cid: references
}

export interface SendEmailOpts {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: ResendAttachment[];
}

export async function sendEmail(opts: SendEmailOpts): Promise<{ id?: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
  return await res.json();
}

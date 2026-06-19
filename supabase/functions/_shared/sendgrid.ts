// Minimal SendGrid v3 Mail Send client over REST (no SDK in Deno).
// POSTs to https://api.sendgrid.com/v3/mail/send.
export interface EmailAttachment {
  filename: string;
  content: string; // base64
  type?: string; // MIME, e.g. "image/png"
  content_id?: string; // for inline cid: references
}

export interface SendEmailOpts {
  from: string; // "Name <email>" or "email" — must be a Verified Single Sender
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

/** Split "Name <email>" into SendGrid's { name, email } shape. */
function parseFrom(from: string): { email: string; name?: string } {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2].trim() };
  return { email: from.trim() };
}

export async function sendEmail(opts: SendEmailOpts): Promise<{ id?: string }> {
  const apiKey = Deno.env.get("SENDGRID_API_KEY");
  if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
  if (!opts.from) throw new Error("EMAIL_FROM is not set");

  const attachments = (opts.attachments ?? []).map((a) => ({
    content: a.content,
    filename: a.filename,
    type: a.type ?? "application/octet-stream",
    disposition: a.content_id ? "inline" : "attachment",
    ...(a.content_id ? { content_id: a.content_id } : {}),
  }));

  const payload = {
    personalizations: [{ to: [{ email: opts.to }] }],
    from: parseFrom(opts.from),
    subject: opts.subject,
    content: [{ type: "text/html", value: opts.html }],
    ...(attachments.length ? { attachments } : {}),
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // SendGrid returns 202 Accepted with an empty body on success.
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SendGrid API error ${res.status}: ${body}`);
  }
  return { id: res.headers.get("x-message-id") ?? undefined };
}

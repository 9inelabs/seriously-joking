// Brevo (formerly Sendinblue) email sender — drops in as a SendGrid replacement.
export interface EmailAttachment {
  filename: string;
  content: string; // base64
  type?: string;
  content_id?: string;
}

export interface SendEmailOpts {
  from: string; // "Name <email>" or just "email"
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

function parseFrom(from: string): { email: string; name?: string } {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2].trim() };
  return { email: from.trim() };
}

export async function sendEmail(opts: SendEmailOpts): Promise<{ id?: string }> {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");
  if (!opts.from) throw new Error("EMAIL_FROM is not set");

  const sender = parseFrom(opts.from);

  const attachments = (opts.attachments ?? []).map((a) => ({
    name: a.filename,
    content: a.content,
    contentType: a.type ?? "application/octet-stream",
    ...(a.content_id ? { contentId: a.content_id } : {}),
  }));

  const payload: Record<string, unknown> = {
    sender,
    to: [{ email: opts.to }],
    subject: opts.subject,
    htmlContent: opts.html,
    ...(attachments.length ? { attachment: attachments } : {}),
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }

  const json = await res.json();
  return { id: json.messageId };
}
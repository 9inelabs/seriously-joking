// Premium, email-client-safe HTML templates (navy + gold, table-based layout,
// all critical CSS inlined, web fonts avoided with serif fallbacks). Kept well
// under 100KB. User/admin-supplied strings are HTML-escaped.

export interface EmailRegistration {
  ref_number: string;
  ticket_id: string;
  package_type: string;
  full_name: string;
  email: string;
  phone: string;
  table_name: string | null;
  seats: number;
  rejection_reason?: string | null;
}

export interface EmailContext {
  siteUrl: string;
  supportPhone: string;
  eventDateISO: string;
  eventVenue: string;
  qrCid?: string;
}

const PACKAGE_LABELS: Record<string, string> = {
  regular: "Regular",
  vip: "VIP",
  table_5: "Five on a Table",
  table_8: "Eight on a Table",
  premium: "Premium Table",
};

const isTable = (t: string) => t === "table_5" || t === "table_8" || t === "premium";

function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(full: string): string {
  return (full || "").trim().split(/\s+/)[0] || "there";
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const o = { timeZone: "Africa/Lagos" } as const;
  return {
    full: d.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric", ...o }),
    time: d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, ...o }).toUpperCase(),
  };
}

const C = {
  bg: "#0A1628",
  card: "#0F1E36",
  card2: "#16294A",
  ink: "#050B14",
  line: "#1F3461",
  gold1: "#F4D58F",
  gold2: "#D4A74A",
  cream: "#F5EDD8",
  cream2: "#E4D9BB",
  mute: "#8A93A6",
};

function shell(inner: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.card};border:1px solid ${C.line};border-radius:16px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;">
${inner}
</table>
</td></tr></table>
</body></html>`;
}

function header(): string {
  return `
<tr><td style="padding:28px 32px 18px;border-bottom:1px solid rgba(212,167,74,0.2);">
  <div style="font-family:Georgia,'Times New Roman',serif;font-weight:bold;font-size:11px;letter-spacing:2px;color:${C.cream2};text-transform:uppercase;">House of Oga Micko</div>
  <div style="font-size:9px;letter-spacing:2px;color:${C.mute};text-transform:uppercase;margin-top:2px;">Presents</div>
</td></tr>`;
}

function wordmark(): string {
  return `
<tr><td style="padding:26px 32px 6px;">
  <div style="font-family:Georgia,'Times New Roman',serif;font-weight:bold;font-size:40px;line-height:1;color:${C.gold1};letter-spacing:1px;">
    <span style="color:${C.cream};">SERIOUSLY</span> JOKING
  </div>
  <div style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:${C.gold1};margin-top:8px;">Live with MC Oga Micko</div>
</td></tr>`;
}

function footer(ctx: EmailContext): string {
  return `
<tr><td style="padding:22px 32px 28px;border-top:1px solid ${C.line};">
  <div style="font-size:12px;color:${C.mute};line-height:1.6;">
    Need a hand? Call support on
    <a href="tel:${esc(ctx.supportPhone)}" style="color:${C.gold1};text-decoration:none;">${esc(ctx.supportPhone)}</a>.
  </div>
  <div style="font-size:11px;color:${C.mute};margin-top:8px;letter-spacing:1px;text-transform:uppercase;">
    House of Oga Micko &middot; A Night of Stand-Up &middot; Owerri
  </div>
</td></tr>`;
}

function row(key: string, val: string): string {
  return `
<tr>
  <td style="padding:9px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.gold2};font-weight:bold;width:42%;vertical-align:top;">${esc(key)}</td>
  <td style="padding:9px 0;font-size:14px;color:${C.cream};font-weight:bold;">${val}</td>
</tr>`;
}

function goldButton(href: string, label: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
  <td align="center" bgcolor="${C.gold2}" style="border-radius:8px;">
    <a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${C.ink};text-decoration:none;font-family:Helvetica,Arial,sans-serif;">${esc(label)}</a>
  </td>
</tr></table>`;
}

// ------------------------------------------------------------------
// TICKET (approved) email
// ------------------------------------------------------------------
export function ticketEmailHtml(reg: EmailRegistration, ctx: EmailContext): string {
  const pkgLabel = PACKAGE_LABELS[reg.package_type] ?? reg.package_type;
  const table = isTable(reg.package_type);
  const { full, time } = fmtDate(ctx.eventDateISO);
  const ticketUrl = `${ctx.siteUrl.replace(/\/$/, "")}/ticket/${encodeURIComponent(reg.ref_number)}`;
  const qrImg = ctx.qrCid
    ? `<img src="cid:${esc(ctx.qrCid)}" width="180" height="180" alt="Entry QR code" style="display:block;border:0;background:${C.cream};padding:10px;border-radius:8px;"/>`
    : "";

  const tableLine = table
    ? `<tr><td style="padding:14px 32px 0;">
        <div style="background:rgba(212,167,74,0.08);border:1px solid rgba(212,167,74,0.22);border-radius:8px;padding:12px 14px;font-size:13px;color:${C.cream2};line-height:1.5;">
          <strong style="color:${C.gold1};">This ticket admits your whole table of ${reg.seats}.</strong> Bring your guests together — you all enter with the host.
        </div></td></tr>`
    : "";

  const inner = `
${header()}
${wordmark()}

<tr><td style="padding:18px 32px 0;">
  <div style="background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.35);border-radius:8px;padding:10px 14px;font-size:13px;color:#4ADE80;font-weight:bold;">
    &#10003; Payment confirmed — you&#39;re in.
  </div>
</td></tr>

<tr><td style="padding:22px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Date", esc(full))}
    ${row("Showtime", `${esc(time)} <span style="color:${C.mute};font-weight:normal;font-size:12px;">&middot; doors 5 PM</span>`)}
    ${row("Venue", esc(ctx.eventVenue))}
    ${row("Package", esc(pkgLabel))}
    ${row(table ? "Seats covered" : "Admits", String(reg.seats))}
    ${row(table ? "Table host" : "Attendee", esc(reg.full_name))}
    ${reg.table_name ? row("Table name", esc(reg.table_name)) : ""}
    ${row("Reference", `<span style="font-family:'Courier New',monospace;letter-spacing:1px;">${esc(reg.ref_number)}</span>`)}
  </table>
</td></tr>

${tableLine}

<tr><td align="center" style="padding:26px 32px 6px;">
  <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.gold2};font-weight:bold;margin-bottom:12px;">Scan at the door</div>
  ${qrImg}
  <div style="font-size:11px;color:${C.mute};margin-top:10px;font-family:'Courier New',monospace;letter-spacing:1px;">${esc(reg.ticket_id)}</div>
</td></tr>

<tr><td align="center" style="padding:22px 32px 28px;">
  ${goldButton(ticketUrl, "View your ticket online")}
</td></tr>

${footer(ctx)}`;

  return shell(inner);
}

// ------------------------------------------------------------------
// REJECTION email
// ------------------------------------------------------------------
export function rejectionEmailHtml(reg: EmailRegistration, ctx: EmailContext): string {
  const reason = (reg.rejection_reason ?? "").trim();
  const inner = `
${header()}
${wordmark()}

<tr><td style="padding:22px 32px 0;">
  <div style="font-size:18px;color:${C.cream};font-weight:bold;">Hi ${esc(firstName(reg.full_name))},</div>
  <p style="font-size:14px;color:${C.cream2};line-height:1.65;margin:12px 0 0;">
    We weren&#39;t able to confirm your payment for reference
    <span style="font-family:'Courier New',monospace;color:${C.cream};">${esc(reg.ref_number)}</span>.
  </p>
</td></tr>

<tr><td style="padding:18px 32px 0;">
  <div style="background:rgba(212,167,74,0.06);border:1px solid rgba(212,167,74,0.2);border-radius:8px;padding:14px 16px;">
    <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.gold2};font-weight:bold;margin-bottom:6px;">Here&#39;s why</div>
    <div style="font-size:14px;color:${C.cream};line-height:1.6;">${esc(reason)}</div>
  </div>
</td></tr>

<tr><td style="padding:18px 32px 0;">
  <p style="font-size:14px;color:${C.cream2};line-height:1.65;margin:0;">
    If you believe this is a mistake, please reach out and we&#39;ll take another look — no problem at all.
  </p>
</td></tr>

<tr><td align="center" style="padding:22px 32px 28px;">
  ${goldButton(`tel:${ctx.supportPhone}`, `Contact support · ${esc(ctx.supportPhone)}`)}
</td></tr>

${footer(ctx)}`;

  return shell(inner);
}

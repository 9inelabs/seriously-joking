import { createElement } from "react";
import QRCode from "qrcode";
import { renderToBuffer } from "@react-pdf/renderer";
import { getRegistrationByRef } from "@/lib/registrations";
import { TicketDocument } from "@/lib/ticketPdf";

// Node runtime (react-pdf needs Node APIs); never cache a per-booking ticket.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { refNumber: string } }
) {
  const ref = decodeURIComponent(params.refNumber);

  let registration;
  try {
    registration = await getRegistrationByRef(ref);
  } catch {
    return new Response("Could not load registration", { status: 502 });
  }

  if (!registration) {
    return new Response("Ticket not found", { status: 404 });
  }
  // A ticket PDF only exists once payment is approved.
  if (registration.payment_status !== "approved") {
    return new Response("Ticket not yet available", { status: 403 });
  }

  // High-res QR as a PNG data URI; brand colours, still high-contrast for scanning.
  const qrDataUrl = await QRCode.toDataURL(registration.ticket_id, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 10,
    color: { dark: "#050B14", light: "#F5EDD8" },
  });

  const buffer = await renderToBuffer(
    // TicketDocument renders a <Document> at runtime; cast past the component
    // element type to the DocumentProps element renderToBuffer expects.
    createElement(TicketDocument, { registration, qrDataUrl }) as unknown as Parameters<
      typeof renderToBuffer
    >[0]
  );

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="seriously-joking-ticket-${ref}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

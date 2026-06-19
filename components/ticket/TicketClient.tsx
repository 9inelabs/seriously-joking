"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useRegistration } from "@/hooks/useRegistration";
import { Ticket } from "./Ticket";

export function TicketClient({ refNumber }: { refNumber: string }) {
  const router = useRouter();
  const { registration, loading, error, notFound, refetch } = useRegistration(refNumber);
  const ticketRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);

  const status = registration?.payment_status;

  // Guard: a ticket only exists once approved. Otherwise back to pending.
  useEffect(() => {
    if (registration && status !== "approved") {
      router.replace(`/pending/${encodeURIComponent(refNumber)}`);
    }
  }, [registration, status, router, refNumber]);

  function Shell({ children }: { children: React.ReactNode }) {
    return (
      <main className="min-h-screen bg-ink-2">
        <SiteHeader cta={{ label: "My Tickets", href: "/" }} />
        {children}
      </main>
    );
  }

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-[820px] px-5 py-16">
          <Skeleton className="mx-auto mb-8 h-6 w-[50%]" />
          <Skeleton className="h-[460px] w-full rounded-lg" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <ErrorState onRetry={refetch} message="We couldn't load your ticket. Try again in a moment." />
      </Shell>
    );
  }

  if (notFound || !registration) {
    return (
      <Shell>
        <ErrorState
          title="We can't find that ticket"
          message="That reference doesn't match anything in our system. Check your link."
        />
      </Shell>
    );
  }

  // Not approved yet — the effect above redirects; render nothing meaningful.
  if (status !== "approved") {
    return (
      <Shell>
        <div className="px-5 py-20 text-center text-mute">Redirecting…</div>
      </Shell>
    );
  }

  async function downloadPdf() {
    const node = ticketRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(node, {
        backgroundColor: "#050B14",
        scale: 2,
        useCORS: true,
        // html2canvas can't render `background-clip: text`; paint the gold
        // gradient headings as solid gold in the clone so they're visible.
        onclone: (doc) => {
          doc.querySelectorAll<HTMLElement>(".gold-text").forEach((el) => {
            el.style.background = "none";
            el.style.color = "#D4A74A";
            el.style.webkitTextFillColor = "#D4A74A";
          });
        },
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`seriously-joking-${registration!.ref_number}.pdf`);
    } catch {
      window.alert("Sorry — the download failed. You can screenshot your ticket instead.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Shell>
      <div className="flex flex-col items-center px-4 py-12 md:px-10 md:py-16">
        <div className="mb-9 text-center">
          <div className="eyebrow justify-center">Ticket confirmed</div>
          <h1 className="mb-2 mt-[14px] font-display text-[clamp(28px,4vw,38px)] uppercase tracking-[.03em] text-cream">
            You&apos;re in. See you at the show.
          </h1>
          <p className="text-[14px] text-mute">
            Show this pass at the door — or just show your phone. We&apos;ll scan the code
            at the entrance.
          </p>
        </div>

        <Ticket ref={ticketRef} registration={registration} />

        <div className="mt-8 flex w-full max-w-[820px] flex-wrap justify-center gap-3">
          <button onClick={downloadPdf} disabled={downloading} className="btn btn-primary">
            {downloading ? (
              <>
                <Spinner size={16} /> Preparing…
              </>
            ) : (
              <>
                <Download size={16} /> Save / Download PDF
              </>
            )}
          </button>
          <button
            onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({ title: "My Seriously Joking ticket", url }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(url);
                window.alert("Ticket link copied — send it to your guests.");
              }
            }}
            className="btn btn-ghost"
          >
            <Send size={16} /> Send to guests
          </button>
        </div>
      </div>
    </Shell>
  );
}

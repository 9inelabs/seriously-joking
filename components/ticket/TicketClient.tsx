"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useRegistration } from "@/hooks/useRegistration";
import { Ticket } from "./Ticket";
import { PACKAGES } from "@/lib/packages";

export function TicketClient({ refNumber }: { refNumber: string }) {
  const router = useRouter();
  const { registration, loading, error, notFound, refetch } = useRegistration(refNumber);
  const [downloading, setDownloading] = useState(false);
  // How many times we've retried waiting for approval to land in Supabase
  const [pollCount, setPollCount] = useState(0);

  const status = registration?.payment_status;
  const isFreePackage =
    registration ? PACKAGES[registration.package_type].price === 0 : false;

  // For free tickets: if status is still "pending", it means the auto-approve
  // hasn't written to Supabase yet. Retry fetching up to 6 times (6 seconds).
  useEffect(() => {
    if (!registration) return;
    if (!isFreePackage) return;
    if (status === "approved") return;

    if (pollCount < 6) {
      const timer = setTimeout(() => {
        refetch();
        setPollCount((c) => c + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [registration, status, isFreePackage, pollCount, refetch]);

  // For paid tickets only: if not approved, send to pending screen.
  useEffect(() => {
    if (!registration) return;
    if (isFreePackage) return; // free tickets wait above, never redirect to pending
    if (status !== "approved") {
      router.replace(`/pending/${encodeURIComponent(refNumber)}`);
    }
  }, [registration, status, isFreePackage, router, refNumber]);

  function Shell({ children }: { children: React.ReactNode }) {
    return (
      <main className="min-h-screen bg-ink-2">
        <SiteHeader cta={{ label: "My Tickets", href: "/" }} />
        {children}
      </main>
    );
  }

  if (loading || (isFreePackage && status !== "approved" && pollCount < 6)) {
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

  // Free ticket still not approved after retries — show a gentle message
  if (isFreePackage && status !== "approved") {
    return (
      <Shell>
        <div className="mx-auto max-w-[560px] px-5 py-20 text-center">
          <h1 className="mb-4 font-display text-[clamp(26px,4vw,36px)] uppercase tracking-[.02em] text-cream">
            Almost there…
          </h1>
          <p className="mb-6 text-[15px] leading-[1.65] text-mute">
            Your free ticket is being confirmed. This usually takes just a second —
            tap the button below to check again.
          </p>
          <button onClick={() => { setPollCount(0); refetch(); }} className="btn btn-primary">
            Check again
          </button>
        </div>
      </Shell>
    );
  }

  // Not approved yet (paid) — redirect effect above handles it
  if (status !== "approved") {
    return (
      <Shell>
        <div className="px-5 py-20 text-center text-mute">Redirecting…</div>
      </Shell>
    );
  }

  async function downloadPdf() {
    setDownloading(true);
    const url = `/api/ticket/${encodeURIComponent(registration!.ref_number)}/pdf`;
    const filename = `seriously-joking-ticket-${registration!.ref_number}.pdf`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    } catch {
      window.location.href = url;
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
            Show this pass at the door — or just show your phone. We&apos;ll scan the
            code at the entrance.
          </p>
        </div>

        <Ticket registration={registration} />

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
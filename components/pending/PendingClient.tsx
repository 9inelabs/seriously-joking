"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, XCircle, LifeBuoy } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRegistration } from "@/hooks/useRegistration";
import { EVENT } from "@/lib/event";

function firstNameOf(full: string): string {
  return full.trim().split(/\s+/)[0] || "there";
}

export function PendingClient({ refNumber }: { refNumber: string }) {
  const router = useRouter();
  // Poll every 8s for an approval decision.
  const { registration, loading, error, notFound, refetch } = useRegistration(
    refNumber,
    8000
  );

  const status = registration?.payment_status;

  useEffect(() => {
    if (status === "approved") {
      router.replace(`/ticket/${encodeURIComponent(refNumber)}`);
    }
  }, [status, router, refNumber]);

  function Shell({ children }: { children: React.ReactNode }) {
    return (
      <main className="min-h-screen bg-ink-2">
        <SiteHeader />
        {children}
      </main>
    );
  }

  // First-load skeleton
  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-[720px] px-5 py-20 text-center">
          <Skeleton className="mx-auto mb-8 h-[88px] w-[88px] rounded-full" />
          <Skeleton className="mx-auto mb-4 h-9 w-[80%]" />
          <Skeleton className="mx-auto mb-10 h-5 w-[60%]" />
          <Skeleton className="mx-auto h-[90px] w-[260px]" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <ErrorState onRetry={refetch} message="We couldn't reach the confirmation service. Your transfer is safe — try again." />
      </Shell>
    );
  }

  if (notFound || !registration) {
    return (
      <Shell>
        <ErrorState
          title="We can't find that reference"
          message="Double-check your link. If you just paid, give it a moment and refresh."
        />
      </Shell>
    );
  }

  // Rejected — apologetic state
  if (status === "rejected") {
    return (
      <Shell>
        <div className="mx-auto max-w-[560px] px-5 py-20 text-center">
          <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-full border border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.08)] text-err">
            <XCircle size={36} />
          </div>
          <h1 className="mb-3 font-display text-[clamp(28px,4vw,40px)] uppercase tracking-[.03em] text-cream">
            We couldn&apos;t confirm this one
          </h1>
          <p className="mx-auto mb-3 max-w-[440px] text-[15px] leading-[1.6] text-mute">
            Our team couldn&apos;t match a transfer to reference{" "}
            <span className="font-mono text-cream-2">{registration.ref_number}</span>. If
            you&apos;ve definitely paid, don&apos;t worry — reach out and we&apos;ll sort it
            out fast.
          </p>
          <a href={`tel:${EVENT.supportPhone}`} className="btn btn-primary mt-6">
            <LifeBuoy size={16} /> Contact support
          </a>
        </div>
      </Shell>
    );
  }

  // Pending (default)
  const submittedAt = new Date(registration.created_at).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });

  return (
    <Shell>
      <div className="mx-auto max-w-[720px] px-5 py-14 text-center md:py-20">
        {/* animated ring */}
        <div className="relative mx-auto mb-8 grid h-[88px] w-[88px] place-items-center rounded-full border border-[rgba(212,167,74,.25)] bg-[rgba(212,167,74,.08)]">
          <span
            aria-hidden
            className="absolute inset-0 animate-pendingPulse rounded-full border border-[rgba(212,167,74,.4)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 animate-pendingPulse rounded-full border border-[rgba(212,167,74,.4)] [animation-delay:1.3s]"
          />
          <Clock size={36} className="relative z-[2] text-gold-1" />
        </div>

        <h1 className="mb-[14px] font-display text-[clamp(32px,4.5vw,44px)] uppercase leading-[1.05] tracking-[.03em] text-cream">
          Thanks, {firstNameOf(registration.full_name)} —<br />
          <span className="text-gold-1">we&apos;re confirming your transfer.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-[480px] text-[15px] leading-[1.6] text-mute">
          Your seat is being held while a member of our team matches your payment.
          You&apos;ll get a text and email the moment your ticket is live — usually within
          half an hour.
        </p>

        {/* reference */}
        <div className="mb-12 inline-block rounded-md border border-dashed border-[rgba(212,167,74,.4)] bg-ink-1 p-6">
          <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[.25em] text-gold-2">
            Your reference number
          </div>
          <div className="font-mono text-[clamp(20px,5vw,30px)] font-bold tracking-[.2em] text-cream">
            {registration.ref_number}
          </div>
        </div>

        {/* timeline */}
        <ol className="mb-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-0">
          <TimelineStep state="done" node="✓" label="Submitted" time={`${submittedAt} today`} pos="first" />
          <TimelineStep state="active" node="2" label="Awaiting confirmation" time="est. 30 mins" pos="mid" />
          <TimelineStep state="todo" node="3" label="Ticket sent" time="SMS + email" pos="last" />
        </ol>

        <div className="rounded-sm border border-line bg-ink-1 p-[18px_22px] text-left text-[13px] leading-[1.6] text-cream-2">
          <strong className="mb-1 block text-[12px] uppercase tracking-[.12em] text-gold-1">
            Keep this tab open if you can
          </strong>
          This page checks itself every few seconds and moves on the moment your ticket is
          approved — no need to chase. We&apos;ve also sent the reference to your phone in
          case you close it.
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={`tel:${EVENT.supportPhone}`} className="btn btn-ghost">
            <LifeBuoy size={16} /> Contact support
          </a>
        </div>
      </div>
    </Shell>
  );
}

function TimelineStep({
  state,
  node,
  label,
  time,
  pos,
}: {
  state: "done" | "active" | "todo";
  node: string;
  label: string;
  time: string;
  pos: "first" | "mid" | "last";
}) {
  const lineColor =
    state === "done" || state === "active"
      ? "var(--gold-grad)"
      : "var(--line)";
  return (
    <li className="relative px-4">
      {/* connector line (desktop only) */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-4 hidden h-px sm:block"
        style={{
          background: lineColor,
          left: pos === "first" ? "50%" : 0,
          right: pos === "last" ? "50%" : 0,
        }}
      />
      <div
        className={[
          "relative z-[2] mx-auto mb-[14px] grid h-8 w-8 place-items-center rounded-full font-mono text-[13px] font-bold",
          state === "done"
            ? "border-transparent bg-gold-grad text-ink-1"
            : state === "active"
              ? "border border-gold-2 text-gold-1 shadow-[0_0_0_4px_rgba(212,167,74,.18)]"
              : "border border-line bg-ink-2 text-mute",
        ].join(" ")}
      >
        {node}
      </div>
      <div
        className={[
          "text-center text-[12px] font-bold uppercase tracking-[.12em]",
          state === "todo" ? "text-mute" : "text-cream",
        ].join(" ")}
      >
        {label}
      </div>
      <div
        className={[
          "text-center text-[11px]",
          state === "active" ? "text-gold-2" : "text-mute-2",
        ].join(" ")}
      >
        {time}
      </div>
    </li>
  );
}

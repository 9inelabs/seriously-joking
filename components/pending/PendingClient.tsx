"use client";

import Link from "next/link";
import { CheckCircle2, LifeBuoy, Mail, Ticket as TicketIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CopyButton } from "@/components/ui/CopyButton";
import { useRegistration } from "@/hooks/useRegistration";
import { EVENT } from "@/lib/event";

function firstNameOf(full: string): string {
  return full.trim().split(/\s+/)[0] || "there";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ink-2">
      <SiteHeader />
      {children}
    </main>
  );
}

export function PendingClient({ refNumber }: { refNumber: string }) {
  // One-shot fetch only — NO polling, NO auto-redirect. The ticket arrives by email.
  const { registration, loading, error, notFound, refetch } = useRegistration(refNumber);

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-[620px] px-5 py-20 text-center">
          <Skeleton className="mx-auto mb-6 h-10 w-[80%]" />
          <Skeleton className="mx-auto mb-10 h-5 w-[65%]" />
          <Skeleton className="mx-auto h-[88px] w-[280px]" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <ErrorState
          onRetry={refetch}
          message="We couldn't load your confirmation just now. Your transfer is safe — try again."
        />
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

  const status = registration.payment_status;

  // Already approved — friendly, no auto-redirect (email is the primary channel).
  if (status === "approved") {
    return (
      <Shell>
        <div className="mx-auto max-w-[560px] px-5 py-20 text-center">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full border border-[rgba(74,222,128,.3)] bg-[rgba(74,222,128,.08)] text-ok">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="mb-3 font-display text-[clamp(26px,4vw,38px)] uppercase tracking-[.02em] text-cream">
            Good news, {firstNameOf(registration.full_name)} — you&apos;re confirmed.
          </h1>
          <p className="mx-auto mb-8 max-w-[440px] text-[15px] leading-[1.6] text-mute">
            Your ticket&apos;s been emailed to{" "}
            <span className="text-cream-2">{registration.email}</span>. You can also open it
            right here.
          </p>
          <Link href={`/ticket/${encodeURIComponent(refNumber)}`} className="btn btn-primary">
            <TicketIcon size={16} /> View your ticket
          </Link>
        </div>
      </Shell>
    );
  }

  // Rejected — apologetic; the detailed reason was emailed.
  if (status === "rejected") {
    return (
      <Shell>
        <div className="mx-auto max-w-[560px] px-5 py-20 text-center">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full border border-[rgba(212,167,74,.3)] bg-[rgba(212,167,74,.08)] text-gold-1">
            <Mail size={34} />
          </div>
          <h1 className="mb-3 font-display text-[clamp(26px,4vw,38px)] uppercase tracking-[.02em] text-cream">
            We&apos;ve emailed you about this booking
          </h1>
          <p className="mx-auto mb-8 max-w-[440px] text-[15px] leading-[1.6] text-mute">
            Check <span className="text-cream-2">{registration.email}</span> for the details on
            reference <span className="font-mono text-cream-2">{registration.ref_number}</span>.
            If you think it&apos;s a mistake, we&apos;re happy to take another look.
          </p>
          <a href={`tel:${EVENT.supportPhone}`} className="btn btn-primary">
            <LifeBuoy size={16} /> Contact support
          </a>
        </div>
      </Shell>
    );
  }

  // Default: pending — calm confirmation, static, safe to close.
  return (
    <Shell>
      <div className="mx-auto max-w-[620px] px-5 py-16 text-center md:py-20">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full border border-[rgba(212,167,74,.25)] bg-[rgba(212,167,74,.08)] text-gold-1">
          <Mail size={28} />
        </div>

        <h1 className="mb-4 font-display text-[clamp(28px,4.5vw,42px)] uppercase leading-[1.08] tracking-[.02em] text-cream">
          Got it, {firstNameOf(registration.full_name)}. We&apos;re on it.
        </h1>
        <p className="mx-auto mb-10 max-w-[500px] text-[15px] leading-[1.65] text-mute">
          We&apos;ve logged your transfer. As soon as our team confirms the payment with the
          bank, your ticket lands in{" "}
          <span className="text-cream-2">{registration.email}</span>. This usually takes under
          30 minutes.
        </p>

        {/* reference + copy */}
        <div className="mx-auto mb-10 inline-flex flex-col items-center gap-4 rounded-md border border-dashed border-[rgba(212,167,74,.4)] bg-ink-1 px-7 py-6">
          <div className="text-[11px] font-bold uppercase tracking-[.25em] text-gold-2">
            Your reference number
          </div>
          <div className="font-mono text-[clamp(20px,5vw,28px)] font-bold tracking-[.2em] text-cream">
            {registration.ref_number}
          </div>
          <CopyButton value={registration.ref_number} label="Copy reference" />
        </div>

        <div className="mx-auto mb-8 max-w-[520px] rounded-sm border border-line bg-ink-1 p-[18px_22px] text-left text-[13px] leading-[1.6] text-cream-2">
          <strong className="mb-1 block text-[12px] uppercase tracking-[.12em] text-gold-1">
            You can close this tab safely
          </strong>
          We&apos;ll email you whether your payment is confirmed or if we need more
          information — either way, you&apos;ll hear from us within the hour.
        </div>

        <a href={`tel:${EVENT.supportPhone}`} className="btn btn-ghost">
          <LifeBuoy size={16} /> Contact support
        </a>
      </div>
    </Shell>
  );
}

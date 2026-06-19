"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { StepStrip } from "@/components/StepStrip";
import { CopyButton } from "@/components/ui/CopyButton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useRegistration } from "@/hooks/useRegistration";
import { setTransferRef } from "@/lib/registrations";
import { PACKAGES, formatNaira } from "@/lib/packages";
import { BANK, EVENT, eventShortDate } from "@/lib/event";

// We store the draft transfer ref in sessionStorage under this key.
// Each order gets its own slot so multiple tabs don't clash.
function draftKey(ref: string) {
  return `sj26_transfer_draft_${ref}`;
}

export function PaymentClient({ refNumber }: { refNumber: string }) {
  const router = useRouter();
  const { registration, loading, error, notFound, refetch } = useRegistration(refNumber);
  const [transferRefInput, setTransferRefInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);

  // ── Restore any saved draft when the component first mounts ──────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(draftKey(refNumber));
      if (saved) {
        setTransferRefInput(saved);
        setRestored(true);
      }
    } catch {
      // sessionStorage blocked (private mode etc.) — fail silently
    }
  }, [refNumber]);

  // ── Persist the draft every time the user types ───────────────────────────
  useEffect(() => {
    try {
      if (transferRefInput) {
        sessionStorage.setItem(draftKey(refNumber), transferRefInput);
      } else {
        sessionStorage.removeItem(draftKey(refNumber));
      }
    } catch {
      // fail silently
    }
  }, [transferRefInput, refNumber]);

  // ── If this order is already approved, jump straight to the ticket ────────
  useEffect(() => {
    if (registration?.payment_status === "approved") {
      router.replace(`/ticket/${encodeURIComponent(refNumber)}`);
    }
  }, [registration?.payment_status, router, refNumber]);

  // ── If the user was previously on the pending screen, send them back ──────
  useEffect(() => {
    if (registration?.payment_status === "pending" && registration?.transfer_ref) {
      router.replace(`/pending/${encodeURIComponent(refNumber)}`);
    }
  }, [registration?.payment_status, registration?.transfer_ref, router, refNumber]);

  function Shell({ children }: { children: React.ReactNode }) {
    return (
      <main className="min-h-screen bg-ink-2">
        <SiteHeader backHref="/#packages" backLabel="← Packages" />
        <div className="px-5 pt-10 md:px-10">
          <StepStrip current={3} />
        </div>
        {children}
      </main>
    );
  }

  if (loading) {
    return (
      <Shell>
        <div className="grid gap-10 px-5 py-9 md:px-10 md:py-14 lg:grid-cols-2">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <ErrorState onRetry={refetch} message="We couldn't load your order. Check your connection and try again." />
      </Shell>
    );
  }

  if (notFound || !registration) {
    return (
      <Shell>
        <ErrorState
          title="We can't find that order"
          message="That reference doesn't match anything in our system. Double-check the link, or start a new booking."
        />
      </Shell>
    );
  }

  const pkg = PACKAGES[registration.package_type];

  async function onAcknowledge() {
    setSubmitting(true);
    try {
      if (transferRefInput.trim()) {
        await setTransferRef(refNumber, transferRefInput.trim());
      }
      // Clear the draft once the user has successfully submitted
      try { sessionStorage.removeItem(draftKey(refNumber)); } catch { /* ignore */ }
    } catch {
      // Saving the optional ref is best-effort — never block the user here.
    } finally {
      router.push(`/pending/${encodeURIComponent(refNumber)}`);
    }
  }

  return (
    <Shell>
      <div className="grid gap-10 px-5 py-9 md:px-10 md:py-14 lg:grid-cols-2">
        {/* summary side */}
        <aside
          className="relative rounded-md border border-[rgba(212,167,74,.2)] p-8"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,167,74,.12), transparent 60%), linear-gradient(180deg, #0F1E36, #16294A)",
          }}
        >
          <div className="eyebrow mb-6">Order Summary</div>
          <div className="font-display text-[26px] uppercase tracking-[.04em]">
            Seriously Joking <span className="gold-text">— Live</span>
          </div>
          <div className="mb-6 mt-1 text-[12px] text-mute">
            with {EVENT.headliner} · {eventShortDate()} · {EVENT.venue}
          </div>

          <div className="perf" />

          <PayLine label="Package" value={pkg.name} />
          <PayLine label={pkg.seats > 1 ? "Seats covered" : "Seat"} value={String(registration.seats)} />
          <PayLine label="Host" value={registration.full_name} />
          <PayLine label="Contact" value={registration.phone} />

          <div className="mt-2 flex items-baseline justify-between border-t border-[rgba(212,167,74,.2)] pt-[18px]">
            <div className="text-[12px] font-bold uppercase tracking-[.15em] text-cream-2">
              Total due
            </div>
            <div className="font-display text-[44px] leading-none gold-text">
              {registration.amount === 0 ? (
                "Free"
              ) : (
                <>
                  <span className="mr-[2px] text-[22px] opacity-80">₦</span>
                  {registration.amount.toLocaleString("en-NG")}
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-[14px] rounded-sm border border-[rgba(212,167,74,.18)] bg-[rgba(212,167,74,.06)] p-[18px]">
            <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[rgba(212,167,74,.15)] text-gold-1">
              <ShieldCheck size={16} />
            </div>
            <div className="text-[13px] leading-[1.55] text-cream-2">
              <strong className="mb-1 block font-bold text-gold-1">
                Confirmed by a human, every time
              </strong>
              We don&apos;t auto-process payments — a real person matches your transfer to
              your order, then your ticket goes live. Usually inside 30 minutes.
            </div>
          </div>
        </aside>

        {/* bank panel */}
        <div className="rounded-md border border-line bg-ink-1 p-8">
          <div className="eyebrow mb-[14px]">Step 03</div>
          <h2 className="font-display text-[24px] uppercase tracking-[.04em] text-cream">
            Send the transfer
          </h2>
          <p className="mb-[26px] mt-2 text-[13px] text-mute">
            Make a single bank transfer to the account below, then tell us once it&apos;s done.
          </p>

          <div
            className="relative mb-[22px] overflow-hidden rounded-md border border-[rgba(212,167,74,.25)] p-6"
            style={{
              background:
                "linear-gradient(135deg, #0F1E36, #16294A 80%, #0F1E36)",
            }}
          >
            <BankRow label="Bank name" value={BANK.name} />
            <BankRow label="Account name" value={BANK.accountName} />
            <BankRow label="Account number" value={BANK.accountNumber} big copyValue={BANK.accountNumber} />
            <BankRow
              label="Amount to transfer"
              value={formatNaira(registration.amount) + (registration.amount ? ".00" : "")}
              copyValue={String(registration.amount)}
            />
            <BankRow label="Use this reference" value={registration.ref_number} last />
          </div>

          {/* Restored draft notice */}
          {restored && (
            <div className="mb-4 rounded-sm border border-[rgba(212,167,74,.25)] bg-[rgba(212,167,74,.07)] px-4 py-3 text-[13px] text-gold-2">
              👋 Welcome back — we kept your transfer reference from earlier.
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-gold-2">
              Transfer reference / receipt number
              <span className="ml-1 font-medium normal-case tracking-normal text-mute">
                — optional, helps us match faster
              </span>
            </label>
            <input
              className="input w-full"
              type="text"
              placeholder="e.g. FID-TXN-8847291"
              value={transferRefInput}
              onChange={(e) => setTransferRefInput(e.target.value)}
            />
          </div>

          <button
            onClick={onAcknowledge}
            disabled={submitting}
            className="btn btn-primary btn-block"
          >
            {submitting ? (
              <>
                <Spinner size={16} /> One sec…
              </>
            ) : (
              <>
                I&apos;ve made the transfer <ArrowRight size={16} />
              </>
            )}
          </button>
          <p className="mt-[14px] text-center text-[11.5px] leading-[1.5] text-mute">
            By tapping the button you&apos;re confirming a real transfer left your bank.
            False claims hold up real ones — please only tap once it&apos;s actually sent.
          </p>
        </div>
      </div>
    </Shell>
  );
}

function PayLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-[10px] text-[14px]">
      <span className="text-mute">{label}</span>
      <span className="font-semibold text-cream">{value}</span>
    </div>
  );
}

function BankRow({
  label,
  value,
  big = false,
  last = false,
  copyValue,
}: {
  label: string;
  value: string;
  big?: boolean;
  last?: boolean;
  copyValue?: string;
}) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_auto] items-center gap-3 py-3",
        last ? "" : "border-b border-dashed border-[rgba(212,167,74,.12)]",
      ].join(" ")}
    >
      <div>
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-gold-2">
          {label}
        </div>
        <div
          className={[
            "font-mono font-semibold text-cream",
            big ? "text-[22px] tracking-[.08em]" : "text-[16px] tracking-[.02em]",
          ].join(" ")}
        >
          {value}
        </div>
      </div>
      <CopyButton value={copyValue ?? value} />
    </div>
  );
}
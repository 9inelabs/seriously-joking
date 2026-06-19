"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { EVENT } from "@/lib/event";

/** Friendly full-screen-ish error with a retry — never a blank white page. */
export function ErrorState({
  title = "Something went sideways",
  message = "We couldn't reach our servers just now. Give it another go in a moment.",
  onRetry,
  retrying = false,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center px-5 py-20 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.08)] text-err">
        <AlertTriangle size={28} />
      </div>
      <h2 className="mb-3 font-display text-[28px] uppercase tracking-[.03em] text-cream">
        {title}
      </h2>
      <p className="mb-8 text-[14px] leading-[1.6] text-mute">{message}</p>
      {onRetry && (
        <button onClick={onRetry} disabled={retrying} className="btn btn-primary">
          <RotateCw size={16} className={retrying ? "animate-spin" : ""} />
          {retrying ? "Retrying…" : "Try again"}
        </button>
      )}
      <a
        href={`tel:${EVENT.supportPhone}`}
        className="mt-5 text-[12px] uppercase tracking-[.12em] text-gold-2 hover:text-gold-1"
      >
        Need help? Call support
      </a>
    </div>
  );
}

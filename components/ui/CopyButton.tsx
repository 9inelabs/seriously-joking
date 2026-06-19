"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard may be unavailable (insecure context) — fail silently
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={[
        "inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-bold uppercase tracking-[.14em] transition-all",
        copied
          ? "border-[rgba(74,222,128,.4)] bg-[rgba(74,222,128,.12)] text-ok"
          : "border-[rgba(212,167,74,.3)] bg-[rgba(212,167,74,.1)] text-gold-1 hover:bg-[rgba(212,167,74,.2)]",
      ].join(" ")}
      aria-label={copied ? "Copied" : `${label} ${value}`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : label}
    </button>
  );
}

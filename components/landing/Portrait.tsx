"use client";

import Image from "next/image";
import { useState } from "react";
// TODO: real headliner photo, auto-renamed from the uploaded WhatsApp file.
// Replace public/hero-image/portrait.jpg to swap it (keep the same path/name).
import portraitImg from "@/public/hero-image/portrait.jpg";

/** Stylised comedian-at-mic silhouette — the placeholder until a real photo lands. */
function Silhouette() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="silG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d325a" />
          <stop offset="100%" stopColor="#050B14" />
        </linearGradient>
        <linearGradient id="rimG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4D58F" stopOpacity="0" />
          <stop offset="50%" stopColor="#F4D58F" stopOpacity=".55" />
          <stop offset="100%" stopColor="#F4D58F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M40,500 C40,420 100,360 160,340 L240,340 C300,360 360,420 360,500 Z" fill="url(#silG)" />
      <path d="M170,340 L170,300 L230,300 L230,340 Z" fill="url(#silG)" />
      <ellipse cx="200" cy="220" rx="70" ry="85" fill="url(#silG)" />
      <path d="M138,205 C138,150 165,118 200,118 C235,118 262,150 262,205" fill="none" stroke="url(#rimG)" strokeWidth="2.5" opacity=".9" />
      <rect x="105" y="365" width="6" height="120" fill="#5C4416" transform="rotate(-22, 108, 425)" />
      <circle cx="78" cy="345" r="22" fill="#9C7325" />
      <circle cx="78" cy="345" r="22" fill="none" stroke="#F4D58F" strokeWidth="1.2" opacity=".8" />
      <line x1="60" y1="338" x2="96" y2="338" stroke="#050B14" strokeWidth="1" opacity=".6" />
      <line x1="58" y1="345" x2="98" y2="345" stroke="#050B14" strokeWidth="1" opacity=".6" />
      <line x1="60" y1="352" x2="96" y2="352" stroke="#050B14" strokeWidth="1" opacity=".6" />
    </svg>
  );
}

export function Portrait() {
  // Render the real photo; if it ever fails to load, fall back to the silhouette
  // so the hero never shows a broken image.
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <div
      className="relative isolate aspect-[4/5] overflow-hidden rounded-lg bg-ink-1"
      // gold spotlight backdrop
      style={{
        background:
          "radial-gradient(ellipse 55% 80% at 50% 20%, rgba(244,213,143,.35), transparent 60%), linear-gradient(180deg, #122745 0%, #050B14 100%)",
      }}
    >
      {/* gold rim */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] rounded-lg"
        style={{
          padding: "1.5px",
          background: "var(--gold-grad)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* live tag — red live dot removed per Round 1, gold border kept */}
      <span className="absolute left-5 top-5 z-[4] inline-flex items-center gap-2 rounded-full border border-[rgba(212,167,74,.3)] bg-[rgba(5,11,20,.75)] px-3 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-gold-1 backdrop-blur-sm">
        Live · Stand-up
      </span>

      {/* photo / silhouette */}
      <div className="absolute inset-0 z-[2] grid place-items-end justify-items-center">
        {hasPhoto ? (
          <Image
            src={portraitImg}
            alt="MC Oga Micko, headlining comedian"
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 900px) 100vw, 480px"
            className="object-cover object-top"
            onError={() => setHasPhoto(false)}
          />
        ) : (
          <Silhouette />
        )}
      </div>

      {/* credit */}
      <div
        className="absolute inset-x-6 bottom-6 z-[4] flex items-end justify-between pt-4"
        style={{ borderTop: "1px solid rgba(244,213,143,.25)" }}
      >
        <div>
          <div className="font-display text-[22px] uppercase tracking-[.08em] text-cream">
            MC Oga Micko
          </div>
          <div className="mt-[2px] text-[10px] font-semibold uppercase tracking-[.2em] text-gold-2">
            Headliner
          </div>
        </div>
        <div className="font-mono text-[11px] tracking-[.15em] text-mute">&apos;26</div>
      </div>
    </div>
  );
}

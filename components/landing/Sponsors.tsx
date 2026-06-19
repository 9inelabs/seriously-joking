const SPONSORS = [
  "CONCEPT",
  "DJ MIX",
  "OZIL FC",
  "DC",
  "CINEMA",
  "VANGUARD",
  "TECHMINDS",
  "DIVINE",
  "OWERRI",
];

export function Sponsors() {
  return (
    <div
      className="px-5 py-10 text-center md:px-10"
      style={{ borderTop: "1px solid rgba(212,167,74,.1)" }}
    >
      <div className="mb-6 text-[11px] uppercase tracking-[.25em] text-mute">
        Official Sponsors
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-70">
        {SPONSORS.map((s) => (
          <div
            key={s}
            className="grid h-9 place-items-center px-[14px] font-display text-[13px] tracking-[.15em] text-cream-2"
            style={{ borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)" }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

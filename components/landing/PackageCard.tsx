import Link from "next/link";
import { Check } from "lucide-react";
import type { PackageDef } from "@/lib/packages";
import { isTablePackage } from "@/lib/packages";

export function PackageCard({ pkg }: { pkg: PackageDef }) {
  const isTable = isTablePackage(pkg.slug);
  const featured = pkg.featured;

  return (
    <article
      className={[
        "group relative flex min-h-[380px] flex-col rounded-md px-[22px] pb-6 pt-7 transition-all duration-300",
        // perforated ticket notches on each side
        "before:absolute before:left-[-10px] before:top-[65%] before:h-[18px] before:w-[18px] before:-translate-y-1/2 before:rounded-full before:border before:border-[rgba(212,167,74,.15)] before:bg-ink-2 before:content-['']",
        "after:absolute after:right-[-10px] after:top-[65%] after:h-[18px] after:w-[18px] after:-translate-y-1/2 after:rounded-full after:border after:border-[rgba(212,167,74,.15)] after:bg-ink-2 after:content-['']",
        "hover:-translate-y-[6px] hover:shadow-card",
        featured
          ? "border border-[rgba(212,167,74,.5)]"
          : "border border-[rgba(212,167,74,.15)] hover:border-[rgba(212,167,74,.35)]",
      ].join(" ")}
      style={
        featured
          ? {
              background:
                "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(212,167,74,.18), transparent 60%), linear-gradient(180deg, #16294A 0%, #0F1E36 100%)",
              boxShadow: "0 0 60px -20px rgba(212,167,74,.4)",
            }
          : {
              background: "linear-gradient(180deg, #0F1E36 0%, #16294A 100%)",
            }
      }
    >
      {featured && pkg.badge && (
        <span className="absolute left-1/2 top-[-12px] -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-grad px-[14px] py-[6px] text-[10px] font-extrabold uppercase tracking-[.2em] text-ink-1 shadow-[0_4px_14px_rgba(212,167,74,.4)]">
          {pkg.badge}
        </span>
      )}

      {!featured && pkg.groupTag && (
        <span className="mb-[14px] inline-flex self-start items-center gap-[6px] rounded-full border border-[rgba(244,213,143,.2)] bg-[rgba(244,213,143,.08)] px-[10px] py-1 text-[10px] font-bold uppercase tracking-[.12em] text-gold-1">
          {pkg.groupTag}
        </span>
      )}

      <div className="mb-1 text-[10px] font-bold uppercase tracking-[.25em] text-gold-2">
        {pkg.tier}
      </div>
      <h3
        className={[
          "mb-4 font-display uppercase leading-[1.05] tracking-[0] text-cream",
          pkg.nameSmall ? "text-[18px]" : "text-[24px]",
        ].join(" ")}
      >
        {pkg.name}
      </h3>

      {/* price — sizes trimmed so "₦150,000" fits the narrow 5-col card in the
          wide display font */}
      {pkg.price === 0 ? (
        <div className="mb-1 font-display text-[26px] leading-none gold-text">Free</div>
      ) : (
        <div className="mb-1 font-display text-[30px] leading-none tracking-[-.01em] gold-text">
          <span className="mr-[2px] text-[16px] opacity-80">₦</span>
          {pkg.price.toLocaleString("en-NG")}
        </div>
      )}
      <div className="mb-[22px] text-[11px] uppercase tracking-[.08em] text-mute">
        {pkg.unit}
      </div>

      {/* seats (tables only) */}
      {isTable && (
        <div className="mb-5 flex flex-wrap gap-1">
          {Array.from({ length: pkg.seats }).map((_, i) => (
            <span
              key={i}
              className="grid h-[22px] w-[22px] place-items-center rounded-full border border-[rgba(212,167,74,.3)] bg-[rgba(212,167,74,.12)] text-[10px] font-bold text-gold-2"
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}

      {/* perks */}
      <ul className="mb-6 flex-grow list-none">
        {pkg.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 py-[5px] text-[12.5px] text-cream-2">
            <Check size={14} className="mt-[2px] flex-shrink-0 text-gold-2" aria-hidden />
            {perk}
          </li>
        ))}
      </ul>

      <Link
        href={`/register?package=${pkg.slug}`}
        className={[
          "rounded-sm px-4 py-[13px] text-center text-[12px] font-bold uppercase tracking-[.12em] transition-all",
          featured
            ? "bg-gold-grad text-ink-1 hover:-translate-y-[1px]"
            : "border border-gold-3 text-gold-1 hover:bg-[rgba(212,167,74,.12)]",
        ].join(" ")}
      >
        {ctaLabel(pkg)}
      </Link>
    </article>
  );
}

function ctaLabel(pkg: PackageDef): string {
  switch (pkg.slug) {
    case "regular":
      return "Reserve seat";
    case "vip":
      return "Get VIP ticket";
    case "table_5":
      return "Book a 5-table";
    case "table_8":
      return "Book an 8-table";
    case "premium":
      return "Book premium";
  }
}

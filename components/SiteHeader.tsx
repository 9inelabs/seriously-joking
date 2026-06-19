import Link from "next/link";
import { Brand } from "./Brand";

/**
 * Shared site header.
 * - Landing uses `nav` (section anchors) + a primary CTA.
 * - Inner pages pass a `backHref`/`backLabel` to show a single ghost link.
 */
export function SiteHeader({
  showNav = false,
  backHref,
  backLabel,
  cta,
}: {
  showNav?: boolean;
  backHref?: string;
  backLabel?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <header
      className="flex items-center justify-between px-5 py-[18px] md:px-10 md:py-[22px]"
      style={{ borderBottom: "1px solid rgba(212,167,74,.1)" }}
    >
      <Brand />

      {showNav && (
        <nav className="hidden gap-7 text-[13px] font-medium text-cream-2 md:flex">
          <a className="hover:text-gold-1" href="#show">The Show</a>
          <a className="hover:text-gold-1" href="#packages">Packages</a>
          <a className="hover:text-gold-1" href="#venue">Venue</a>
          <a className="hover:text-gold-1" href="#contact">Contact</a>
        </nav>
      )}

      {backHref ? (
        <Link
          href={backHref}
          className="rounded-full border border-gold-3 px-[18px] py-[10px] text-[12px] font-bold uppercase tracking-[.12em] text-gold-1 transition-colors hover:bg-[rgba(212,167,74,.1)]"
        >
          {backLabel ?? "Back"}
        </Link>
      ) : cta ? (
        <Link
          href={cta.href}
          className="rounded-full border border-gold-3 px-[18px] py-[10px] text-[12px] font-bold uppercase tracking-[.12em] text-gold-1 transition-all hover:border-transparent hover:bg-gold-grad hover:text-ink-1"
        >
          {cta.label}
        </Link>
      ) : null}
    </header>
  );
}

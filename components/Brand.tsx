import Link from "next/link";

/** The "M · Oga Micko / House of Comedy" lockup used in headers and the ticket. */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3" aria-label="Oga Micko — House of Comedy, home">
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-full bg-ink-1 text-[18px] text-gold-1"
        style={{ border: "1.5px solid var(--gold-2)" }}
      >
        M
      </span>
      <span className="font-display text-[18px] uppercase leading-tight tracking-[.14em]">
        Oga Micko
        <small className="block font-body text-[9px] font-semibold tracking-[.3em] text-mute">
          House of Comedy
        </small>
      </span>
    </Link>
  );
}

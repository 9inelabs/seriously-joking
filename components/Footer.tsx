import { EVENT } from "@/lib/event";

export function Footer() {
  const tel = EVENT.supportPhone;
  const telPretty = tel.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  return (
    <footer
      id="contact"
      className="flex flex-wrap items-center justify-between gap-4 bg-ink-1 px-5 py-7 text-[12px] text-mute md:px-10"
    >
      <div>© 2026 House of Oga Micko · Owerri, Imo State</div>
      <div>
        Sponsorship &amp; Enquiries ·{" "}
        <a className="text-cream-2 hover:text-gold-1" href={`tel:${tel}`}>
          {telPretty}
        </a>
      </div>
    </footer>
  );
}

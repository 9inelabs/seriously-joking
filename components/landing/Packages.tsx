import { PACKAGES, PACKAGE_ORDER } from "@/lib/packages";
import { PackageCard } from "./PackageCard";

export function Packages() {
  return (
    <section id="packages" className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
      <div className="mb-12 grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="eyebrow">Pick a Seat</div>
          <h2 className="mt-3 font-anton text-[clamp(34px,5vw,56px)] uppercase leading-[.95] tracking-[.02em] text-cream">
            Five Ways
            <br />
            to <span className="text-gold-1">Show Up</span>
          </h2>
        </div>
        <p className="max-w-[320px] text-[14px] text-mute">
          From a free seat in the room to a private table for eight — every option puts you in the laugh.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PACKAGE_ORDER.map((slug) => (
          <PackageCard key={slug} pkg={PACKAGES[slug]} />
        ))}
      </div>
    </section>
  );
}

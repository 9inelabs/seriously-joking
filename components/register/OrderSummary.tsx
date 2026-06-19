import { PACKAGES, formatNaira, type PackageType } from "@/lib/packages";
import { eventShortDate } from "@/lib/event";

/** Sticky right-rail summary on the register screen (updates as the host types). */
export function OrderSummary({
  packageType,
  hostName,
}: {
  packageType: PackageType;
  hostName: string;
}) {
  const pkg = PACKAGES[packageType];
  return (
    <aside className="sticky top-20 rounded-md border border-[rgba(212,167,74,.2)] bg-[linear-gradient(180deg,#0F1E36,#16294A)] px-6 py-7">
      <h2 className="mb-[18px] border-b border-line pb-[14px] text-[11px] uppercase tracking-[.2em] text-gold-2">
        Order summary
      </h2>

      <div className="mb-[18px] rounded-sm border border-line bg-[rgba(5,11,20,.5)] p-[14px]">
        <div className="mb-1 font-display text-[16px] uppercase tracking-[.04em] text-cream">
          Seriously Joking
        </div>
        <div className="text-[11px] text-mute">
          {eventShortDate()} · Lavianto Lounge
        </div>
      </div>

      <SummaryRow label="Package" value={pkg.name} />
      <SummaryRow label={pkg.seats > 1 ? "Seats covered" : "Seat"} value={String(pkg.seats)} />
      <SummaryRow label="Host" value={hostName || "—"} />

      <div className="perf my-[18px]" />

      <SummaryRow label="Subtotal" value={formatNaira(pkg.price)} />
      <SummaryRow label="Service fee" value="— Waived" />

      <div className="mb-[6px] mt-[18px] flex items-baseline justify-between text-[14px]">
        <span className="text-[11px] font-bold uppercase tracking-[.1em] text-cream-2">
          Total due
        </span>
        <span className="font-display text-[28px] tracking-[.02em] gold-text">
          {formatNaira(pkg.price)}
        </span>
      </div>

      <p className="mt-[14px] text-[11px] leading-[1.5] text-mute">
        Manual bank transfer · confirmed within 30 minutes by our team.
      </p>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-[10px] flex items-baseline justify-between text-[13px]">
      <span className="text-mute">{label}</span>
      <span className="font-semibold text-cream">{value}</span>
    </div>
  );
}

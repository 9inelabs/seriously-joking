"use client";

import { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Users } from "lucide-react";
import type { Registration } from "@/lib/registrations";
import { PACKAGES, isTablePackage } from "@/lib/packages";
import { EVENT } from "@/lib/event";

function Cell({
  label,
  value,
  sub,
  full = false,
}: {
  label: string;
  value: string;
  sub?: string;
  full?: boolean;
}) {
  return (
    <div className={`py-3 ${full ? "col-span-2" : ""}`}>
      <div className="mb-[6px] text-[10px] font-bold uppercase tracking-[.22em] text-gold-2">
        {label}
      </div>
      <div className="font-display text-[18px] uppercase tracking-[.04em] text-cream">
        {value}
        {sub && (
          <small className="mt-[2px] block font-body text-[11px] font-medium normal-case tracking-[.04em] text-mute">
            {sub}
          </small>
        )}
      </div>
    </div>
  );
}

export const Ticket = forwardRef<HTMLElement, { registration: Registration }>(
  function Ticket({ registration }, ref) {
    const pkg = PACKAGES[registration.package_type];
    const isTable = isTablePackage(registration.package_type);
    const eventDate = new Date(EVENT.dateISO);
    const dateLine = eventDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
    const weekday = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      timeZone: "Africa/Lagos",
    });
    const time = eventDate.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    });

    return (
      <article
        ref={ref}
        className="relative grid w-full max-w-[820px] grid-cols-1 overflow-hidden rounded-lg bg-ink-1 md:grid-cols-[1fr_240px]"
        style={{
          boxShadow:
            "0 50px 100px -30px rgba(0,0,0,.7), 0 0 0 1px rgba(212,167,74,.3)",
        }}
      >
        {/* ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 0% 0%, rgba(212,167,74,.15), transparent 60%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(15,30,54,.8), transparent)",
          }}
        />

        {/* main */}
        <div className="relative p-6 md:p-9">
          <header className="mb-7 flex items-center justify-between border-b border-[rgba(212,167,74,.18)] pb-[18px]">
            <div className="font-display text-[14px] uppercase tracking-[.2em] text-cream-2">
              House of Oga Micko
              <small className="block font-body text-[9px] font-semibold tracking-[.25em] text-mute">
                Presents
              </small>
            </div>
            <span className="rounded-full bg-gold-grad px-3 py-[6px] text-[10px] font-extrabold uppercase tracking-[.22em] text-ink-1">
              {pkg.name} · {pkg.tier}
            </span>
          </header>

          <h1 className="font-display text-[clamp(48px,6vw,64px)] uppercase leading-[.88] tracking-[.02em]">
            <span className="block text-cream">Seriously</span>
            <span className="block gold-text">Joking</span>
          </h1>
          <div className="mb-7 mt-2 font-script text-[26px] leading-none text-gold-1">
            Live with {EVENT.headliner}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-[18px]">
            <Cell
              label={isTable ? "Table host" : "Attendee"}
              value={registration.full_name}
              sub={registration.phone}
            />
            {isTable ? (
              <Cell
                label="Table name"
                value={registration.table_name || pkg.name}
                sub={`${pkg.seats} seats`}
              />
            ) : (
              <Cell label="Admits" value={pkg.seats === 1 ? "1 guest" : `${pkg.seats} guests`} sub={pkg.unit} />
            )}
            <Cell label="Date" value={dateLine} sub={`${weekday} · doors 5 PM`} />
            <Cell label="Showtime" value={time.toUpperCase()} sub="show ends ~9 PM" />
            <Cell label="Venue" value={EVENT.venue} full />
          </div>

          {isTable && (
            <div className="flex items-center gap-3 rounded-sm border border-[rgba(212,167,74,.22)] bg-[rgba(212,167,74,.08)] p-[14px_16px]">
              <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[rgba(212,167,74,.15)] text-gold-1">
                <Users size={16} />
              </div>
              <div className="text-[13px] leading-[1.5] text-cream-2">
                <strong className="text-gold-1">Valid for a table of {pkg.seats}.</strong>{" "}
                All guests enter together with the table host. Names can be edited up to
                24h before the show.
              </div>
            </div>
          )}
        </div>

        {/* perforation */}
        <div
          aria-hidden
          className="relative hidden w-[2px] md:block"
          style={{
            background:
              "radial-gradient(circle 12px at 50% 0, #050B14 98%, transparent), radial-gradient(circle 12px at 50% 100%, #050B14 98%, transparent)",
          }}
        >
          <span
            className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(212,167,74,.35) 50%, transparent 0)",
              backgroundSize: "1px 8px",
            }}
          />
        </div>

        {/* stub */}
        <aside
          className="relative flex flex-col items-center gap-[18px] p-9 px-6 text-center"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(212,167,74,.18), transparent 60%), linear-gradient(180deg, #0F1E36, #0A1628)",
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[.25em] text-gold-2">
            Scan at the door
          </div>
          <div className="rounded-sm bg-cream p-[10px] shadow-[0_10px_30px_rgba(0,0,0,.4)]">
            <QRCodeCanvas
              value={registration.ticket_id}
              size={160}
              level="M"
              bgColor="#F5EDD8"
              fgColor="#050B14"
            />
          </div>
          <div className="mt-auto">
            <div className="mb-1 text-[9px] uppercase tracking-[.25em] text-mute">
              Ticket ID
            </div>
            <div className="font-mono text-[12px] tracking-[.14em] text-cream-2">
              {registration.ticket_id}
            </div>
          </div>
        </aside>
      </article>
    );
  }
);

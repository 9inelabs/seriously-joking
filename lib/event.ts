/** Event-wide constants, read from env where configurable. */

export const EVENT = {
  name: "Seriously Joking",
  headliner: "MC Oga Micko",
  brand: "House of Oga Micko",
  brandSub: "House of Comedy",
  dateISO: process.env.NEXT_PUBLIC_EVENT_DATE ?? "2026-07-10T18:00:00+01:00",
  venue: process.env.NEXT_PUBLIC_EVENT_VENUE ?? "Lavianto Lounge, Ikenegbu, Owerri",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "08080355773",
} as const;

export const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "",
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "",
} as const;

/** "Fri 10 Jul · 6:00 PM" style short label */
export function eventShortDate(): string {
  const d = new Date(EVENT.dateISO);
  const day = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "Africa/Lagos" });
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "Africa/Lagos" });
  const time = d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" });
  return `${day} ${date} · ${time.toUpperCase()}`;
}

import { supabase } from "./supabase";
import type { PackageType } from "./packages";
import { PACKAGES } from "./packages";

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Guest {
  seat_number: number;
  name: string | null;
  contact: string | null;
}

export interface Registration {
  id: string;
  ref_number: string;
  ticket_id: string;
  package_type: PackageType;
  full_name: string;
  email: string;
  phone: string;
  table_name: string | null;
  seats: number;
  amount: number;
  payment_status: PaymentStatus;
  transfer_ref: string | null;
  created_at: string;
  approved_at: string | null;
  guests: Guest[];
}

export interface NewRegistrationInput {
  packageType: PackageType;
  fullName: string;
  email: string;
  phone: string; // full, e.g. "+234 803 412 9087"
  tableName?: string;
  guests?: { seat_number: number; name: string | null; contact: string | null }[];
}

/**
 * Readable, reasonably unique reference: SJ26-<initials><tag>-<stamp>
 * e.g. SJ26-CHIN3T-4821
 */
export function generateRefNumber(fullName: string, packageType: PackageType): string {
  const initials =
    fullName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4) || "GUEST";
  const tag = PACKAGES[packageType].tag;
  const stamp = Math.floor(Math.random() * 9000 + 1000);
  return `SJ26-${initials}${tag}-${stamp}`;
}

/** Opaque-ish scannable ticket id encoded in the QR, e.g. SJ26-T03-9F4K2A */
function generateTicketId(packageType: PackageType): string {
  const tierNum = PACKAGES[packageType].tier.replace(/\D/g, "").padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 6; i++) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SJ26-T${tierNum}-${token}`;
}

function asRegistration(data: unknown): Registration {
  return data as Registration;
}

/**
 * Create a registration, retrying with a fresh ref on the (rare) collision.
 * Returns the created Registration (with guests).
 */
export async function createRegistration(
  input: NewRegistrationInput
): Promise<Registration> {
  const pkg = PACKAGES[input.packageType];
  const MAX_TRIES = 5;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    const ref = generateRefNumber(input.fullName, input.packageType);
    const ticketId = generateTicketId(input.packageType);

    const { data, error } = await supabase.rpc("create_registration", {
      p_ref: ref,
      p_ticket_id: ticketId,
      p_package_type: input.packageType,
      p_full_name: input.fullName,
      p_email: input.email,
      p_phone: input.phone,
      p_table_name: input.tableName ?? null,
      p_seats: pkg.seats,
      p_amount: pkg.price,
      p_guests: input.guests ?? [],
    });

    if (!error) return asRegistration(data);

    // 23505 = unique_violation → ref/ticket collision, regenerate & retry
    if (error.code === "23505") {
      lastError = error;
      continue;
    }
    throw new Error(error.message || "Could not create your registration.");
  }

  throw new Error(
    (lastError as { message?: string })?.message ||
      "Could not generate a unique reference. Please try again."
  );
}

export async function getRegistrationByRef(
  ref: string
): Promise<Registration | null> {
  const { data, error } = await supabase.rpc("get_registration_by_ref", {
    p_ref: ref,
  });
  if (error) throw new Error(error.message || "Could not load your registration.");
  if (!data) return null;
  return asRegistration(data);
}

export async function setTransferRef(
  ref: string,
  transferRef: string
): Promise<Registration | null> {
  const { data, error } = await supabase.rpc("set_transfer_ref", {
    p_ref: ref,
    p_transfer_ref: transferRef,
  });
  if (error) throw new Error(error.message || "Could not save your transfer reference.");
  if (!data) return null;
  return asRegistration(data);
}

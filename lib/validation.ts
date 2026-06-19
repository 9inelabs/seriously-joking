import { z } from "zod";

// Nigerian local mobile number, entered without the +234 prefix.
// Accepts spaces; 7–11 digits to be forgiving of "0803…" vs "803…".
const phoneRegex = /^[0-9][0-9\s]{6,14}$/;

const guestSchema = z.object({
  name: z.string().trim().max(80, "That name is too long").optional().or(z.literal("")),
  contact: z.string().trim().max(120).optional().or(z.literal("")),
});

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter the host's full name")
    .max(80, "That name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid phone number"),
  tableName: z.string().trim().max(60, "Keep the table name short").optional().or(z.literal("")),
  guests: z.array(guestSchema).optional(),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/** Normalise the local phone entry into a stored "+234 …" string. */
export function toFullPhone(local: string): string {
  const digits = local.replace(/\D/g, "").replace(/^0/, "");
  return `+234 ${digits}`;
}

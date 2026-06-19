import { supabase } from "@/lib/supabase";
import { getRegistrationByRef } from "@/lib/registrations";

export async function POST(
  _req: Request,
  { params }: { params: { refNumber: string } }
) {
  const ref = decodeURIComponent(params.refNumber);

  // Load the registration
  const registration = await getRegistrationByRef(ref);
  if (!registration) {
    return new Response("Registration not found", { status: 404 });
  }

  // Only allow this for free (regular) packages — safety check
  if (registration.amount !== 0) {
    return new Response("Not a free package", { status: 403 });
  }

  // Already approved? Just return success
  if (registration.payment_status === "approved") {
    return new Response("OK", { status: 200 });
  }

  // Auto-approve the row in Supabase
  const { error } = await supabase
    .from("registrations")
    .update({
      payment_status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("ref_number", ref);

  if (error) {
    return new Response("Could not approve registration", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
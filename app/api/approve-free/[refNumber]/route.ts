import { supabase } from "@/lib/supabase";

export async function POST(
  _req: Request,
  { params }: { params: { refNumber: string } }
) {
  const ref = decodeURIComponent(params.refNumber);

  const { data, error } = await supabase.rpc("approve_free_registration", {
    p_ref: ref,
  });

  if (error) {
    if (error.message?.includes("NOT_FOUND")) {
      return new Response("Registration not found", { status: 404 });
    }
    if (error.message?.includes("NOT_FREE")) {
      return new Response("Not a free package", { status: 403 });
    }
    return new Response("Could not approve registration", { status: 500 });
  }

  if (!data) {
    return new Response("Registration not found", { status: 404 });
  }

  return new Response("OK", { status: 200 });
}
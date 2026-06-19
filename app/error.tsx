"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for logging/observability.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-ink-2">
      <SiteHeader />
      <ErrorState
        title="Something broke on our end"
        message="We hit an unexpected error. Try again — if it keeps happening, give us a call and we'll help."
        onRetry={reset}
      />
    </main>
  );
}

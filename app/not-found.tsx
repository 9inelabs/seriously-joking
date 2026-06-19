import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink-2">
      <SiteHeader />
      <div className="mx-auto max-w-[480px] px-5 py-20 text-center">
        <div className="mb-4 font-display text-[clamp(64px,12vw,120px)] leading-none gold-text">
          404
        </div>
        <h1 className="mb-3 font-display text-[24px] uppercase tracking-[.03em] text-cream">
          This page took the night off
        </h1>
        <p className="mb-8 text-[14px] text-mute">
          We couldn&apos;t find what you were looking for. Let&apos;s get you back to the show.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to the show
        </Link>
      </div>
    </main>
  );
}

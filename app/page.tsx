import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Packages } from "@/components/landing/Packages";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { Sponsors } from "@/components/landing/Sponsors";

export default function LandingPage() {
  return (
    <main className="bg-ink-2">
      <SiteHeader showNav cta={{ label: "Get a Ticket", href: "#packages" }} />
      <Hero />
      <div className="mt-14">
        <Marquee />
      </div>
      <Packages />
      <TrustStrip />
      <Sponsors />
      <Footer />
    </main>
  );
}

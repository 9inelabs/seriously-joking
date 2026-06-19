import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Portrait } from "./Portrait";

function MetaChip({
  icon,
  strong,
  span,
}: {
  icon: React.ReactNode;
  strong: string;
  span: string;
}) {
  return (
    <div className="flex items-center gap-[10px] rounded-sm border border-[rgba(212,167,74,.18)] bg-[rgba(15,30,54,.6)] px-[14px] py-[10px] text-[13px]">
      <span aria-hidden className="text-gold-2">{icon}</span>
      <strong className="font-semibold text-cream">{strong}</strong>
      <span className="ml-1 text-[12px] text-mute">{span}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="show" className="relative overflow-hidden px-5 pt-9 md:px-10 md:pt-[60px]">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(212,167,74,.18), transparent 60%), radial-gradient(ellipse 80% 50% at 20% 80%, rgba(15,30,54,.9), transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-12">
        {/* copy */}
        <div>
          <div className="eyebrow mb-6">House of Oga Micko · Presents</div>

          <h1 className="mb-3 font-display text-[clamp(56px,9vw,124px)] uppercase leading-[.88] tracking-[.01em]">
            <span className="block text-cream">Seriously</span>
            <span className="block translate-x-[.05em] gold-text">Joking</span>
          </h1>

          <div className="mb-[6px] mt-2 font-script text-[clamp(32px,4vw,48px)] leading-none text-gold-1">
            <span className="text-cream">Live with</span> MC Oga Micko
          </div>

          <div className="mb-9 font-display text-[clamp(22px,3vw,32px)] uppercase tracking-[.04em] text-cream-2">
            A Night of Stand-Up <span className="text-gold-1">◆</span> Owerri
          </div>

          <div className="mb-9 flex flex-wrap gap-3">
            <MetaChip icon={<Calendar size={16} />} strong="10 July, 2026" span="Friday" />
            <MetaChip icon={<Clock size={16} />} strong="6:00 PM" span="doors at 5" />
            <MetaChip icon={<MapPin size={16} />} strong="Lavianto Lounge" span="Ikenegbu, Owerri" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="#packages" className="btn btn-primary">
              Choose a Package <ArrowRight size={16} />
            </Link>
            <a href="#show" className="btn btn-ghost">
              Watch a Clip
            </a>
          </div>
        </div>

        {/* portrait */}
        <Portrait />
      </div>
    </section>
  );
}

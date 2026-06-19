import Image from "next/image";
import type { StaticImageData } from "next/image";

// Real sponsor logos. Static imports give next/image the intrinsic dimensions,
// so each logo renders at a uniform height with its natural width (wider logos
// get more room, none are squished).
// TODO: these were auto-renamed from the uploaded WhatsApp files to
// sponsor-1…8.jpeg. Rename/replace individual files as real sponsor art lands,
// and set a descriptive `alt` per sponsor.
import s1 from "@/public/sponsor-images/sponsor-1.jpeg";
import s2 from "@/public/sponsor-images/sponsor-2.jpeg";
import s3 from "@/public/sponsor-images/sponsor-3.jpeg";
import s4 from "@/public/sponsor-images/sponsor-4.jpeg";
import s5 from "@/public/sponsor-images/sponsor-5.jpeg";
import s6 from "@/public/sponsor-images/sponsor-6.jpeg";
import s7 from "@/public/sponsor-images/sponsor-7.jpeg";
import s8 from "@/public/sponsor-images/sponsor-8.jpeg";

const SPONSORS: StaticImageData[] = [s1, s2, s3, s4, s5, s6, s7, s8];

export function Sponsors() {
  return (
    <div
      className="px-5 py-10 text-center md:px-10"
      style={{ borderTop: "1px solid rgba(212,167,74,.1)" }}
    >
      <div className="mb-7 text-[11px] uppercase tracking-[.25em] text-mute">
        Official Sponsors
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {SPONSORS.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Seriously Joking sponsor ${i + 1}`}
            sizes="160px"
            className="h-10 w-auto object-contain opacity-75 grayscale-[0.3] transition duration-200 hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}

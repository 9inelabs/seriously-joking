"use client";

import { motion, useReducedMotion } from "framer-motion";

const ITEMS = [
  "Seriously Joking",
  "Live Stand-Up",
  "10 . 07 . 2026",
  "Lavianto Lounge",
  "Owerri",
  "House of Oga Micko",
];

function Group() {
  return (
    <span className="flex items-center gap-12">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-12">
          {item}
          <span aria-hidden className="text-[14px] text-gold-2">◆</span>
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  const reduce = useReducedMotion();

  return (
    <div
      className="overflow-hidden py-[18px]"
      style={{
        borderTop: "1px solid rgba(212,167,74,.15)",
        borderBottom: "1px solid rgba(212,167,74,.15)",
        background: "linear-gradient(180deg, transparent, rgba(15,30,54,.3), transparent)",
      }}
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap font-display text-[18px] uppercase tracking-[.25em] text-cream-2"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 38, ease: "linear", repeat: Infinity }
        }
      >
        <Group />
        <Group />
      </motion.div>
    </div>
  );
}

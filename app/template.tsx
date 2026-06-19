"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps each route in a gentle fade. We animate opacity ONLY — a transform
 * (translate/scale) on this ancestor would break `position: sticky` on the
 * order-summary rail. Reduced-motion users get an instant render.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

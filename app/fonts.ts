import { Bowlby_One, Allura, Inter, JetBrains_Mono } from "next/font/google";

// Display — bold poster type used for headlines, package names, ticket title.
// TODO: swap Bowlby One → Akira Expanded once the licensed font files are
// provided (drop .woff2 into public/fonts/akira-expanded/, add an @font-face in
// globals.css, and prepend 'Akira Expanded' to the display stack in
// tailwind.config.ts). Bowlby One is the closest free stand-in for that bold,
// wide, brushy feel. It is exposed through the SAME --font-display variable, so
// no consumer code changes when we swap.
export const displayFont = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Script — the "Live with…" flourish (UNCHANGED)
export const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Body — UI copy (UNCHANGED)
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Mono — reference numbers, ticket IDs, numeric labels (UNCHANGED)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${allura.variable} ${inter.variable} ${jetbrainsMono.variable}`;

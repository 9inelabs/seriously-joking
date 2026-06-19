import { Anton, Allura, Inter, JetBrains_Mono } from "next/font/google";

// Display — bold poster type used for headlines, package names, ticket title
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Script — the "Live with…" flourish
export const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Body — UI copy
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Mono — reference numbers, ticket IDs, numeric labels
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${anton.variable} ${allura.variable} ${inter.variable} ${jetbrainsMono.variable}`;

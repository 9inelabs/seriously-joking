import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seriously-joking.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Seriously Joking — Live with MC Oga Micko",
  description:
    "A night of live stand-up comedy with MC Oga Micko. Friday 10 July 2026 · Lavianto Lounge, Owerri. Reserve your seat or book a table.",
  openGraph: {
    title: "Seriously Joking — Live with MC Oga Micko",
    description:
      "A night of live stand-up comedy with MC Oga Micko. Friday 10 July 2026 · Lavianto Lounge, Owerri.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050B14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-ink-1 text-cream font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </body>
    </html>
  );
}

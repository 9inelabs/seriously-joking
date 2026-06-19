import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seriously-joking.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal, per-booking pages must never be indexed.
      disallow: ["/register", "/payment/", "/pending/", "/ticket/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

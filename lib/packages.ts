export type PackageType = "regular" | "vip" | "table_5" | "table_8" | "premium";

export interface PackageDef {
  slug: PackageType;
  tier: string; // "Tier 01"
  name: string;
  /** smaller display name flag for the long table names */
  nameSmall?: boolean;
  price: number; // in Naira; 0 = free
  unit: string; // "1 seat · general standing"
  seats: number; // total seats covered by one purchase
  perks: string[];
  /** ref-number tag, e.g. "2V" */
  tag: string;
  featured?: boolean;
  badge?: string; // "★ Most Picked"
  groupTag?: string; // "◆ Table of 5"
}

export const PACKAGES: Record<PackageType, PackageDef> = {
  regular: {
    slug: "regular",
    tier: "Tier 01",
    name: "Regular",
    price: 0,
    unit: "1 seat · general standing",
    seats: 1,
    tag: "1G",
    perks: [
      "Entry to the main floor",
      "First-come, first-served",
    ],
  },
  vip: {
    slug: "vip",
    tier: "Tier 02",
    name: "VIP",
    price: 10000,
    unit: "1 seat · reserved row",
    seats: 1,
    tag: "2V",
    featured: true,
    badge: "★ Most Picked",
    perks: [
      "Reserved seating, front block",
      "Skip the entry queue",
    ],
  },
  table_5: {
    slug: "table_5",
    tier: "Tier 03",
    name: "Five on a Table",
    nameSmall: true,
    price: 50000,
    unit: "one purchase · seats five",
    seats: 5,
    tag: "3T",
    groupTag: "◆ Table of 5",
    perks: [
      "Shared table, mid-floor",
      "Bottle service available",
      "One host books all seats",
    ],
  },
  table_8: {
    slug: "table_8",
    tier: "Tier 04",
    name: "Eight on a Table",
    nameSmall: true,
    price: 100000,
    unit: "one purchase · seats eight",
    seats: 8,
    tag: "4T",
    groupTag: "◆ Table of 8",
    perks: [
      "Larger table, side-floor",
      "Reserved waitperson",
    ],
  },
  premium: {
    slug: "premium",
    tier: "Tier 05",
    name: "Premium Table",
    nameSmall: true,
    price: 150000,
    unit: "one purchase · seats eight, premium",
    seats: 8,
    tag: "5P",
    groupTag: "◆ Front Row · Table",
    perks: [
      "Front-floor, stage-adjacent",
      "Premium bottle service",
      "Backstage meet & greet",
      "House of Oga Micko gift pack",
    ],
  },
};

export const PACKAGE_ORDER: PackageType[] = [
  "regular",
  "vip",
  "table_5",
  "table_8",
  "premium",
];

export function isPackageType(value: string | null | undefined): value is PackageType {
  return !!value && value in PACKAGES;
}

export function isTablePackage(slug: PackageType): boolean {
  return slug === "table_5" || slug === "table_8" || slug === "premium";
}

/** Naira formatting: ₦50,000 */
export function formatNaira(amount: number): string {
  if (amount === 0) return "Free";
  return "₦" + amount.toLocaleString("en-NG");
}

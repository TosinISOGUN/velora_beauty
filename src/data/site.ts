/**
 * Site-wide copy and links. VELORA BEAUTY is a fictional brand made for a design portfolio:
 * nothing here describes a real company, address, phone line, policy or product.
 */

/** Injected at build time from the deployment domain (see scripts/site-origin.mjs). */
export const SITE_URL: string = import.meta.env.VITE_SITE_URL;

/** The brand is fictional, so no page asks search engines to index it. Flip to allow indexing. */
export const INDEXABLE = false;

export const site = {
  name: "VELORA BEAUTY",
  short: "VELORA",
  tagline: "Your beauty. Your kind of beautiful.",
  support: "Color, care, and little rituals that feel like you.",
  /** A reserved .example address: it cannot receive mail. */
  email: "hello@velora.example",
} as const;

export const SHOP_CTA = "Shop the Collection";
export const STORY_CTA = "Discover VELORA";
export const ADD_CTA = "Add to Bag";

export const CONCEPT_NOTE =
  "VELORA BEAUTY is a fictional brand made for a design portfolio. The products, prices, policies and people are sample content. Nothing here can be bought and no order is ever placed.";

export type LinkTarget =
  | { to: "/" | "/shop" | "/about" | "/routine" | "/contact" | "/cart" | "/privacy" | "/terms" }
  | { to: "/collections/$slug"; params: { slug: "lips" | "cheeks" | "complexion" } };

export type NavItem = { label: string } & LinkTarget;

export const nav: NavItem[] = [
  { label: "Shop", to: "/shop" },
  { label: "Lips", to: "/collections/$slug", params: { slug: "lips" } },
  { label: "Cheeks", to: "/collections/$slug", params: { slug: "cheeks" } },
  { label: "Complexion", to: "/collections/$slug", params: { slug: "complexion" } },
  { label: "Our Story", to: "/about" },
];

export const footerShop: NavItem[] = [
  { label: "All products", to: "/shop" },
  ...nav.filter((n) => n.to === "/collections/$slug"),
  { label: "Build a routine", to: "/routine" },
];

export const footerHelp: NavItem[] = [
  { label: "Contact and FAQ", to: "/contact" },
  { label: "Our Story", to: "/about" },
  { label: "Shopping bag", to: "/cart" },
];

export const footerLegal: NavItem[] = [
  { label: "Privacy notice", to: "/privacy" },
  { label: "Terms of use", to: "/terms" },
];

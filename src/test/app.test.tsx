import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { images } from "@/data/images.generated";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import * as site from "@/data/site";
import { routeTree } from "@/routeTree.gen";

describe("routing", () => {
  const router = createRouter({ routeTree });
  const paths = [
    "/",
    "/shop",
    ...CATEGORIES.map((c) => `/collections/${c.slug}`),
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
    "/about",
    "/routine",
    "/cart",
    "/checkout",
    "/contact",
    "/privacy",
    "/terms",
  ];

  it.each(paths)("matches a page for %s instead of falling back to not found", (path) => {
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("covers the ten routes from the brief", () => {
    const required = [
      "/",
      "/shop",
      "/collections/lips",
      "/collections/cheeks",
      "/collections/complexion",
    ];
    for (const p of required) expect(paths).toContain(p);
    expect(paths).toContain("/products/skin-veil-tint");
    for (const p of ["/about", "/routine", "/cart", "/contact"]) expect(paths).toContain(p);
  });

  it("falls back to not found for an unknown path", () => {
    expect(router.matchRoutes("/lyrics").at(-1)?.routeId).toBe(rootRouteId);
  });
});

describe("content", () => {
  it("only references photographs the image pipeline produced", () => {
    for (const p of PRODUCTS) {
      for (const img of p.images)
        expect(images, `${p.slug}: ${img.image}`).toHaveProperty(img.image);
    }
  });

  it("ships a share image for every product and page", () => {
    const names = [
      "home",
      "shop",
      "lips",
      "cheeks",
      "complexion",
      "about",
      "routine",
      "cart",
      "checkout",
      "contact",
      "privacy",
      "terms",
      ...PRODUCTS.map((p) => p.slug),
    ];
    for (const n of names) {
      expect(existsSync(join(process.cwd(), "public/og", `${n}.jpg`)), n).toBe(true);
    }
  });

  it("makes no health, certification or review claims", () => {
    const all = JSON.stringify([PRODUCTS, CATEGORIES, site.site, site.CONCEPT_NOTE]).toLowerCase();
    for (const word of [
      "dermatologist",
      "hypoallergenic",
      "vegan",
      "cruelty-free",
      "organic",
      "clinically",
      "reviews",
      "bestseller",
      "★",
    ]) {
      expect(all, word).not.toContain(word);
    }
  });

  it("keeps the concept out of search results and discloses it", () => {
    expect(site.INDEXABLE).toBe(false);
    expect(site.CONCEPT_NOTE.toLowerCase()).toContain("fictional");
  });

  it("uses one label per intent", () => {
    expect(site.SHOP_CTA).toBe("Shop the Collection");
    expect(site.ADD_CTA).toBe("Add to Bag");
  });
});

/** Every .ts and .tsx file under src, so a stray em dash anywhere in the copy fails the build. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "test" ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !name.endsWith(".gen.ts") ? [full] : [];
  });
}

describe("copy rules", () => {
  it("has no em or en dashes in any source file", () => {
    const offenders = sourceFiles(join(process.cwd(), "src")).filter((f) =>
      /[–—]/.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});

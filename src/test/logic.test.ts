import { describe, expect, it } from "vitest";

import {
  PRODUCTS,
  describeSelections,
  formatPrice,
  getProductBySlug,
  lineKey,
  missingGroups,
  packagingHex,
} from "@/data/products";
import {
  addLine,
  countItems,
  parseSavedBag,
  removeLine,
  resolveLines,
  setLineQty,
  subtotalOf,
  type BagLine,
} from "@/lib/bag-logic";
import {
  DEFAULT_FILTERS,
  applyFilters,
  parseFilters,
  searchProducts,
  type Filters,
} from "@/lib/catalog";
import { GOALS, buildRoutine } from "@/lib/routine";

const product = (slug: string) => {
  const p = getProductBySlug(slug);
  if (!p) throw new Error(`missing product ${slug}`);
  return p;
};

describe("product data", () => {
  it("has the six demo products with unique slugs", () => {
    expect(PRODUCTS).toHaveLength(6);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(6);
  });

  it("formats prices without trailing zeros", () => {
    expect(formatPrice(26)).toBe("$26");
    expect(formatPrice(26.5)).toBe("$26.50");
  });

  it("asks for every option group before a shaded product can be bagged", () => {
    const blush = product("soft-focus-cream-blush");
    expect(missingGroups(blush, {}).map((g) => g.id)).toEqual(["shade"]);
    expect(missingGroups(blush, { shade: "peony" })).toHaveLength(0);
    expect(missingGroups(blush, { shade: "not-a-shade" })).toHaveLength(1);
    expect(missingGroups(product("dew-drop-serum"), {})).toHaveLength(0);
  });

  it("needs both a blush and a lip shade for the set", () => {
    const set = product("the-daily-edit-set");
    expect(missingGroups(set, { blush: "peony" }).map((g) => g.id)).toEqual(["lip"]);
    expect(missingGroups(set, { blush: "peony", lip: "cherry-silk" })).toHaveLength(0);
  });

  it("describes choices in words, not colour alone", () => {
    const set = product("the-daily-edit-set");
    expect(describeSelections(set, { blush: "peony", lip: "cherry-silk" })).toBe(
      "Blush shade: Peony, Lip shade: Cherry Silk",
    );
    expect(describeSelections(set, {})).toBe("");
  });

  it("colours the packaging from the chosen shade", () => {
    const lip = product("cloud-kiss-lip-treatment");
    expect(packagingHex(lip, { shade: "fig-noir" })).toBe("#6B3040");
    expect(packagingHex(lip, {})).toBe(lip.mockupHex);
  });
});

describe("bag logic", () => {
  const blush = product("soft-focus-cream-blush");
  const serum = product("dew-drop-serum");

  it("adds a line and merges the same product with the same shade", () => {
    let lines: BagLine[] = [];
    lines = addLine(lines, blush, { shade: "peony" });
    lines = addLine(lines, blush, { shade: "peony" }, 2);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.qty).toBe(3);
  });

  it("keeps different shades of one product as separate lines", () => {
    let lines: BagLine[] = [];
    lines = addLine(lines, blush, { shade: "peony" });
    lines = addLine(lines, blush, { shade: "berry" });
    expect(lines).toHaveLength(2);
  });

  it("refuses a shaded product with no shade", () => {
    expect(addLine([], blush, {})).toEqual([]);
  });

  it("calculates line totals, item count and subtotal", () => {
    let lines: BagLine[] = [];
    lines = addLine(lines, blush, { shade: "peony" }, 2);
    lines = addLine(lines, serum, {});
    const resolved = resolveLines(lines);
    expect(resolved.map((l) => l.lineTotal)).toEqual([68, 38]);
    expect(countItems(resolved)).toBe(3);
    expect(subtotalOf(resolved)).toBe(106);
  });

  it("changes quantity, removes at zero, and removes a line", () => {
    let lines = addLine([], serum, {}, 2);
    const key = lineKey(serum, {});
    lines = setLineQty(lines, key, 5);
    expect(lines[0]?.qty).toBe(5);
    expect(setLineQty(lines, key, 0)).toEqual([]);
    expect(removeLine(lines, key)).toEqual([]);
  });

  it("caps quantity at 99", () => {
    expect(addLine([], serum, {}, 500)[0]?.qty).toBe(99);
  });

  it("drops unknown products and stale shades when resolving", () => {
    const resolved = resolveLines([
      { slug: "ghost", selections: {}, qty: 1 },
      { slug: blush.slug, selections: { shade: "retired" }, qty: 1 },
      { slug: serum.slug, selections: {}, qty: 1 },
    ]);
    expect(resolved.map((l) => l.product.slug)).toEqual(["dew-drop-serum"]);
  });

  it("reads saved bags defensively", () => {
    expect(parseSavedBag(null)).toEqual([]);
    expect(parseSavedBag("not json")).toEqual([]);
    expect(parseSavedBag('{"a":1}')).toEqual([]);
    expect(parseSavedBag('[{"slug":"dew-drop-serum","selections":{},"qty":2},{"x":1}]')).toEqual([
      { slug: "dew-drop-serum", selections: {}, qty: 2 },
    ]);
  });
});

describe("catalog filters", () => {
  const f = (patch: Partial<Filters>): Filters => ({ ...DEFAULT_FILTERS, ...patch });

  it("shows everything by default", () => {
    expect(applyFilters(DEFAULT_FILTERS)).toHaveLength(6);
  });

  it("filters by category", () => {
    expect(applyFilters(f({ category: "complexion" })).map((p) => p.slug)).toEqual([
      "skin-veil-tint",
      "dew-drop-serum",
      "everyday-glow-balm",
    ]);
    expect(applyFilters(f({ category: "set" }))).toHaveLength(1);
  });

  it("filters by price band", () => {
    expect(applyFilters(f({ price: "under-30" })).map((p) => p.price)).toEqual([26, 28]);
    expect(applyFilters(f({ price: "30-40" })).map((p) => p.price)).toEqual([34, 38]);
    expect(applyFilters(f({ price: "over-40" })).map((p) => p.price)).toEqual([42, 82]);
  });

  it("combines filters and can return nothing", () => {
    expect(applyFilters(f({ category: "lips", price: "over-40" }))).toEqual([]);
  });

  it("sorts by name and by price", () => {
    expect(applyFilters(f({ sort: "name" }))[0]?.name).toBe("Cloud Kiss Lip Treatment");
    const asc = applyFilters(f({ sort: "price-asc" })).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = applyFilters(f({ sort: "price-desc" })).map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("parses untrusted search params", () => {
    expect(parseFilters({ category: "lips", price: "under-30", sort: "name" })).toEqual({
      category: "lips",
      price: "under-30",
      sort: "name",
    });
    expect(parseFilters({ category: "<script>", price: 5, sort: null })).toEqual(DEFAULT_FILTERS);
  });

  it("searches by name and category, ignoring case", () => {
    expect(searchProducts("BLUSH").map((p) => p.slug)).toContain("soft-focus-cream-blush");
    expect(searchProducts("lips").length).toBeGreaterThan(0);
    expect(searchProducts("   ")).toEqual([]);
    expect(searchProducts("zzzz")).toEqual([]);
  });
});

describe("routine builder", () => {
  it("returns real products for every goal, even with every optional answer skipped", () => {
    for (const { id } of GOALS) {
      const picks = buildRoutine({ goal: id });
      expect(picks.length, id).toBeGreaterThanOrEqual(2);
      for (const p of picks) expect(getProductBySlug(p.product.slug), p.product.slug).toBeDefined();
    }
  });

  it("never guesses a tint shade", () => {
    const tint = buildRoutine({ goal: "everyday" }).find(
      (p) => p.product.slug === "skin-veil-tint",
    );
    expect(tint?.needsChoice.map((g) => g.id)).toEqual(["shade"]);
  });

  it("makes complete, valid choices for every other product", () => {
    for (const { id } of GOALS) {
      for (const pick of buildRoutine({ goal: id, finish: "bold", undertone: "warm" })) {
        if (pick.product.slug === "skin-veil-tint") continue;
        expect(missingGroups(pick.product, pick.selections)).toHaveLength(0);
      }
    }
  });

  it("follows the undertone and finish answers", () => {
    const warm = buildRoutine({ goal: "color", undertone: "warm" });
    expect(warm.find((p) => p.product.slug === "cloud-kiss-lip-treatment")?.selections).toEqual({
      shade: "terracotta-bloom",
    });
    const sheer = buildRoutine({ goal: "color", finish: "sheer", undertone: "cool" });
    expect(sheer.find((p) => p.product.slug === "soft-focus-cream-blush")?.selections).toEqual({
      shade: "peony",
    });
  });
});

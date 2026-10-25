import {
  getProductBySlug,
  lineKey,
  missingGroups,
  type Product,
  type Selections,
} from "@/data/products";

export interface BagLine {
  slug: string;
  selections: Selections;
  qty: number;
}

export interface ResolvedLine {
  key: string;
  product: Product;
  selections: Selections;
  qty: number;
  lineTotal: number;
}

export const MAX_QTY = 99;

const clampQty = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(n)));

function keyOf(line: BagLine): string {
  const product = getProductBySlug(line.slug);
  return product ? lineKey(product, line.selections) : line.slug;
}

/** Merges into an existing line with the same product and choices, otherwise appends. */
export function addLine(
  lines: BagLine[],
  product: Product,
  selections: Selections,
  qty = 1,
): BagLine[] {
  if (missingGroups(product, selections).length > 0) return lines;
  const key = lineKey(product, selections);
  const clean: Selections = Object.fromEntries(
    product.groups.map((g) => [g.id, selections[g.id] ?? ""]),
  );
  const next = lines.some((l) => keyOf(l) === key)
    ? lines.map((l) => (keyOf(l) === key ? { ...l, qty: clampQty(l.qty + qty) } : l))
    : [...lines, { slug: product.slug, selections: clean, qty: clampQty(qty) }];
  return next.filter((l) => l.qty > 0);
}

export function setLineQty(lines: BagLine[], key: string, qty: number): BagLine[] {
  return lines
    .map((l) => (keyOf(l) === key ? { ...l, qty: clampQty(qty) } : l))
    .filter((l) => l.qty > 0);
}

export function removeLine(lines: BagLine[], key: string): BagLine[] {
  return lines.filter((l) => keyOf(l) !== key);
}

/**
 * Joins lines with the product data. Lines for unknown products, or with choices that no longer
 * exist (for example from an older saved bag), are dropped rather than shown half-resolved.
 */
export function resolveLines(lines: BagLine[]): ResolvedLine[] {
  return lines.flatMap((l) => {
    const product = getProductBySlug(l.slug);
    if (!product || l.qty < 1) return [];
    if (missingGroups(product, l.selections).length > 0) return [];
    return [
      {
        key: lineKey(product, l.selections),
        product,
        selections: l.selections,
        qty: l.qty,
        lineTotal: product.price * l.qty,
      },
    ];
  });
}

export const countItems = (lines: ResolvedLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const subtotalOf = (lines: ResolvedLine[]) => lines.reduce((n, l) => n + l.lineTotal, 0);

/** Parses saved bag JSON defensively; anything unexpected becomes an empty bag. */
export function parseSavedBag(raw: string | null): BagLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((row): BagLine[] => {
      if (!row || typeof row !== "object") return [];
      const { slug, selections, qty } = row as Record<string, unknown>;
      if (typeof slug !== "string" || typeof qty !== "number") return [];
      const sel: Selections = {};
      if (selections && typeof selections === "object") {
        for (const [k, v] of Object.entries(selections)) if (typeof v === "string") sel[k] = v;
      }
      return [{ slug, selections: sel, qty: clampQty(qty) }];
    });
  } catch {
    return [];
  }
}

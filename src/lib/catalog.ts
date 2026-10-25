import { PRODUCTS, type CategorySlug, type Product } from "@/data/products";

export type SortKey = "featured" | "name" | "price-asc" | "price-desc";
export type PriceBand = "any" | "under-30" | "30-40" | "over-40";
export type CategoryFilter = CategorySlug | "set" | "all";

export interface Filters {
  category: CategoryFilter;
  price: PriceBand;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = { category: "all", price: "any", sort: "featured" };

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "name", label: "Name, A to Z" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
];

export const PRICE_BANDS: { id: PriceBand; label: string; test: (price: number) => boolean }[] = [
  { id: "any", label: "Any price", test: () => true },
  { id: "under-30", label: "Under $30", test: (p) => p < 30 },
  { id: "30-40", label: "$30 to $40", test: (p) => p >= 30 && p <= 40 },
  { id: "over-40", label: "Over $40", test: (p) => p > 40 },
];

export const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "lips", label: "Lips" },
  { id: "cheeks", label: "Cheeks" },
  { id: "complexion", label: "Complexion" },
  { id: "set", label: "Sets" },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  if (sort === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
  return list;
}

export function applyFilters(filters: Filters, products: Product[] = PRODUCTS): Product[] {
  const band = PRICE_BANDS.find((b) => b.id === filters.price) ?? PRICE_BANDS[0]!;
  const filtered = products.filter(
    (p) => (filters.category === "all" || p.category === filters.category) && band.test(p.price),
  );
  return sortProducts(filtered, filters.sort);
}

export const isDefault = (f: Filters) =>
  f.category === DEFAULT_FILTERS.category &&
  f.price === DEFAULT_FILTERS.price &&
  f.sort === DEFAULT_FILTERS.sort;

/** Header search: matches name, tagline, category and description, ignoring case. */
export function searchProducts(query: string, products: Product[] = PRODUCTS): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.tagline, p.categoryLabel, p.short].some((s) => s.toLowerCase().includes(q)),
  );
}

const pick = <T extends string>(value: unknown, list: readonly T[], fallback: T): T =>
  typeof value === "string" && (list as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

/** Turns untrusted URL search params into valid filters, falling back to the defaults. */
export function parseFilters(search: Record<string, unknown>): Filters {
  return {
    category: pick(
      search["category"],
      CATEGORY_FILTERS.map((c) => c.id),
      DEFAULT_FILTERS.category,
    ),
    price: pick(
      search["price"],
      PRICE_BANDS.map((b) => b.id),
      DEFAULT_FILTERS.price,
    ),
    sort: pick(
      search["sort"],
      SORTS.map((s) => s.id),
      DEFAULT_FILTERS.sort,
    ),
  };
}

/** Search params without the values that equal the defaults, so the URL stays clean. */
export function toSearch(f: Filters) {
  return {
    ...(f.category !== DEFAULT_FILTERS.category && { category: f.category }),
    ...(f.price !== DEFAULT_FILTERS.price && { price: f.price }),
    ...(f.sort !== DEFAULT_FILTERS.sort && { sort: f.sort }),
  };
}

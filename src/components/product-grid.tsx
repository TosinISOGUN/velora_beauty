import type { Product } from "@/data/products";

import { ProductCard } from "./product-card";

const COLUMNS = {
  3: "lg:grid-cols-3 lg:gap-x-8",
  4: "lg:grid-cols-4 lg:gap-x-6",
} as const;

/** Responsive product grid: two columns on phones, three or four on large screens. */
export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: keyof typeof COLUMNS;
}) {
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 ${COLUMNS[columns]}`}>
      {products.map((p) => (
        <li key={p.slug} className="reveal">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

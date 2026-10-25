import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { formatPrice, isShaded, type Product } from "@/data/products";
import { ADD_CTA } from "@/data/site";
import { useBag } from "@/lib/bag";
import { TILE } from "@/lib/style";

import { ProductMockup } from "./product-mockup";

/** Product tile: packaging on a category-coloured ground, name, price, and one clear action. */
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useBag();
  const shaded = isShaded(product);
  const group = product.groups[0];
  const isSet = product.category === "set";
  const optionCount = group?.options.length ?? 0;

  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="flex flex-1 flex-col"
        aria-label={`${product.name}, ${formatPrice(product.price)}`}
      >
        <div
          className="glow-tile relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[var(--radius-card)] p-6 transition-shadow duration-500 group-hover:shadow-[var(--shadow)]"
          style={{ "--tile": TILE[product.category], "--glow": product.mockupHex } as CSSProperties}
        >
          <ProductMockup
            kind={product.mockup}
            hex={product.mockupHex}
            className="h-full max-h-[17rem] w-auto transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
          />
          {group && !isSet && (
            <span
              aria-hidden
              className="glass absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full px-2.5 py-1.5"
            >
              {group.options.slice(0, 5).map((o) => (
                <span
                  key={o.id}
                  className="h-3 w-3 rounded-full border border-fg/25"
                  style={{ background: o.hex }}
                />
              ))}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[1.3rem] leading-tight">{product.name}</h3>
            <p className="mt-1 text-sm text-muted">{product.tagline}</p>
            {group && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                {optionCount} {group.label.toLowerCase()}s
              </p>
            )}
          </div>
          <p className="shrink-0 font-bold">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <div className="mt-4">
        {shaded ? (
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="btn btn-ghost w-full"
          >
            Choose {group?.label.toLowerCase() ?? "options"}
          </Link>
        ) : (
          <button type="button" onClick={() => addItem(product)} className="btn btn-ghost w-full">
            {ADD_CTA}
            <span className="sr-only">: {product.name}</span>
          </button>
        )}
      </div>
    </article>
  );
}

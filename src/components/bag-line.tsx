import { Minus, Plus, Trash } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { describeSelections, formatPrice, packagingHex } from "@/data/products";
import { useBag } from "@/lib/bag";
import type { ResolvedLine } from "@/lib/bag-logic";

import { ProductMockup } from "./product-mockup";

const SURFACE = {
  lips: "bg-s-lips",
  cheeks: "bg-s-cheeks",
  complexion: "bg-s-complexion",
  set: "bg-s-set",
} as const;

/** One line of the bag: packaging, name, chosen shade in words, quantity stepper, line total. */
export function BagLine({ line, onNavigate }: { line: ResolvedLine; onNavigate?: () => void }) {
  const { setQty, removeItem } = useBag();
  const { product, selections, qty, key } = line;
  const detail = describeSelections(product, selections);
  const hex = packagingHex(product, selections);
  const hex2 =
    product.slug === "the-daily-edit-set"
      ? product.groups[0]?.options.find((o) => o.id === selections["blush"])?.hex
      : undefined;

  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-4 py-5">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        onClick={onNavigate}
        aria-label={product.name}
        className={`grid aspect-square place-items-center rounded-2xl ${SURFACE[product.category]}`}
      >
        <ProductMockup
          kind={product.mockup}
          hex={hex}
          {...(hex2 ? { hex2 } : {})}
          className="h-[4.6rem] w-auto"
        />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              onClick={onNavigate}
              className="font-display text-[1.15rem] leading-tight text-fg hover:underline"
            >
              {product.name}
            </Link>
            {detail && <p className="mt-0.5 text-sm text-muted">{detail}</p>}
          </div>
          <p className="text-sm font-bold">{formatPrice(line.lineTotal)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div
            role="group"
            aria-label={`Quantity of ${product.name}`}
            className="inline-flex items-center rounded-full border border-line"
          >
            <button
              type="button"
              className="icon-btn"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={() => setQty(key, qty - 1)}
            >
              <Minus size={16} aria-hidden />
            </button>
            <span className="w-8 text-center text-sm font-bold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="icon-btn"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={() => setQty(key, qty + 1)}
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(key)}
            className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-muted hover:text-accent-text"
          >
            <Trash size={18} aria-hidden /> Remove
            <span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

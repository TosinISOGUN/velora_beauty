import { Handbag } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { formatPrice } from "@/data/products";
import { useBag } from "@/lib/bag";

import { BagLine } from "./bag-line";
import { Sheet } from "./sheet";

/** The bag as a side drawer: opens whenever something is added, or from the header. */
export function BagDrawer() {
  const { isOpen, closeBag, items, subtotal, count } = useBag();

  return (
    <Sheet
      open={isOpen}
      onClose={closeBag}
      side="right"
      label="Shopping bag"
      title={`Your bag${count > 0 ? ` (${count})` : ""}`}
    >
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <Handbag size={44} className="text-accent-text" aria-hidden />
          <p className="font-display text-[1.6rem] text-fg">Your bag is empty.</p>
          <p className="max-w-[28ch] text-muted">
            Start with the pieces everyone reaches for first.
          </p>
          <Link to="/shop" onClick={closeBag} className="btn btn-primary">
            Browse the collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {items.map((line) => (
              <BagLine key={line.key} line={line} onNavigate={closeBag} />
            ))}
          </ul>
          <div className="border-t border-line bg-bg p-5">
            <p className="flex items-baseline justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-display text-[1.6rem] text-fg">{formatPrice(subtotal)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Sample prices. Shipping and tax are not calculated in this concept.
            </p>
            <div className="mt-4 grid gap-2">
              <Link to="/cart" onClick={closeBag} className="btn btn-primary">
                View bag
              </Link>
              <button type="button" onClick={closeBag} className="btn btn-ghost">
                Continue shopping
              </button>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}

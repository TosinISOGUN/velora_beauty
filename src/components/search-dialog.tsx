import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { CATEGORIES, formatPrice } from "@/data/products";
import { searchProducts } from "@/lib/catalog";

import { ProductMockup } from "./product-mockup";
import { Sheet } from "./sheet";

/** Product search over the demo catalog, in a dialog that opens from the header. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const results = searchProducts(query);

  useEffect(() => {
    if (open) input.current?.focus();
    else setQuery("");
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} side="top" label="Search">
      <form role="search" className="p-5 sm:p-7" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="site-search" className="font-display text-[1.5rem] text-fg">
          Search VELORA
        </label>
        <div className="relative mt-3">
          <MagnifyingGlass
            size={22}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg"
          />
          <input
            id="site-search"
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Blush, serum, lips"
            autoComplete="off"
            className="field !pl-12"
          />
        </div>
        <div className="mt-5 min-h-[7rem]" aria-live="polite">
          {query.trim() === "" ? (
            <ul className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    onClick={onClose}
                    className="chip"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <p className="text-muted">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a product type such as blush, lips
              or serum.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="group flex min-h-16 items-center gap-4 py-2"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-bg-2">
                      <ProductMockup kind={p.mockup} hex={p.mockupHex} className="h-12 w-auto" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-fg">{p.name}</span>
                      <span className="block truncate text-sm text-muted">{p.tagline}</span>
                    </span>
                    <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                    <ArrowRight
                      size={18}
                      aria-hidden
                      className="text-accent-text transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </Sheet>
  );
}

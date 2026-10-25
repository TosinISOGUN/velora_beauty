import { SlidersHorizontal } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";

import type { Product } from "@/data/products";
import {
  CATEGORY_FILTERS,
  DEFAULT_FILTERS,
  PRICE_BANDS,
  SORTS,
  applyFilters,
  isDefault,
  type CategoryFilter,
  type Filters,
  type PriceBand,
  type SortKey,
} from "@/lib/catalog";

import { ProductGrid } from "./product-grid";
import { Sheet } from "./sheet";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  /** Hides the category filter on collection pages, where the category is fixed. */
  lockedCategory?: boolean;
  products?: Product[];
};

function Controls({
  value,
  onChange,
  lockedCategory,
  idPrefix,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  lockedCategory: boolean;
  idPrefix: string;
}) {
  return (
    <div className="space-y-7">
      {!lockedCategory && (
        <fieldset>
          <legend className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-fg">
            Category
          </legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={value.category === c.id}
                onClick={() => onChange({ ...value, category: c.id as CategoryFilter })}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-fg">Price</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className="chip"
              aria-pressed={value.price === b.id}
              onClick={() => onChange({ ...value, price: b.id as PriceBand })}
            >
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label
          htmlFor={`${idPrefix}-sort`}
          className="mb-3 block text-sm font-bold uppercase tracking-[0.1em] text-fg"
        >
          Sort by
        </label>
        <select
          id={`${idPrefix}-sort`}
          className="field"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** Desktop toolbar: category and price as chips, sort as a compact select, all on one line. */
function Toolbar({
  value,
  onChange,
  lockedCategory,
  idPrefix,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  lockedCategory: boolean;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {!lockedCategory && (
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Category</legend>
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={value.category === c.id}
              onClick={() => onChange({ ...value, category: c.id as CategoryFilter })}
            >
              {c.label}
            </button>
          ))}
        </fieldset>
      )}
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Price</legend>
        {PRICE_BANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            className="chip"
            aria-pressed={value.price === b.id}
            onClick={() => onChange({ ...value, price: b.id as PriceBand })}
          >
            {b.label}
          </button>
        ))}
      </fieldset>
      <div className="ml-auto flex items-center gap-3">
        <label htmlFor={`${idPrefix}-sort`} className="caps-serif text-[0.78rem] tracking-[0.2em]">
          Sort
        </label>
        <select
          id={`${idPrefix}-sort`}
          className="field !w-auto !min-w-[11rem]"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * The shared shopping view for the shop and collection pages: filters that act on the real
 * product list, a count, a reset, an empty state, and a bottom sheet with Apply and Reset on phones.
 */
export function CatalogView({ filters, onChange, lockedCategory = false, products }: Props) {
  const id = useId();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);
  const list = applyFilters(filters, products);
  const base = DEFAULT_FILTERS;
  const active = !isDefault(filters);
  const activeCount =
    (!lockedCategory && filters.category !== "all" ? 1 : 0) +
    (filters.price !== "any" ? 1 : 0) +
    (filters.sort !== "featured" ? 1 : 0);

  const reset = () => onChange(base);

  return (
    <div>
      <div className="hidden border-b border-line pb-5 lg:block">
        <Toolbar
          value={filters}
          onChange={onChange}
          lockedCategory={lockedCategory}
          idPrefix={`${id}-d`}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-4">
            <p
              className="caps-serif text-[0.8rem] tracking-[0.2em] text-muted"
              role="status"
              aria-live="polite"
            >
              {list.length} {list.length === 1 ? "piece" : "pieces"}
            </p>
            {active && (
              <button
                type="button"
                className="btn-text hidden !min-h-11 lg:inline-flex"
                onClick={reset}
              >
                Reset filters
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost !min-h-11 lg:hidden"
            aria-haspopup="dialog"
            onClick={() => {
              setDraft(filters);
              setSheetOpen(true);
            }}
          >
            <SlidersHorizontal size={18} aria-hidden />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-[var(--radius-card)] bg-bg-2 p-8 text-center sm:p-12">
            <p className="font-display text-[1.8rem] text-fg">Nothing matches those filters.</p>
            <p className="mx-auto mt-2 max-w-[40ch] text-muted">
              Try a wider price range, or clear the filters to see the whole collection.
            </p>
            <button type="button" className="btn btn-primary mt-6" onClick={reset}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <ProductGrid products={list} columns={3} />
          </div>
        )}

        {lockedCategory && (
          <p className="mt-14">
            <Link to="/shop" className="btn-text">
              Browse the full shop
            </Link>
          </p>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        side="bottom"
        label="Filters"
        title="Filters"
      >
        <div className="flex-1 overflow-y-auto p-5">
          <Controls
            value={draft}
            onChange={setDraft}
            lockedCategory={lockedCategory}
            idPrefix={`${id}-m`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-line bg-bg p-4">
          <button type="button" className="btn btn-ghost" onClick={() => setDraft(base)}>
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onChange(draft);
              setSheetOpen(false);
            }}
          >
            Show {applyFilters(draft, products).length}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

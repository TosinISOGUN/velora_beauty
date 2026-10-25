import { Handbag } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { BagLine } from "@/components/bag-line";
import { formatPrice } from "@/data/products";
import { useBag } from "@/lib/bag";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () =>
    seo({
      title: "Your Bag | VELORA BEAUTY",
      description:
        "Review the demo products in your bag. A fictional beauty concept: nothing is charged or shipped.",
      image: "cart",
    }),
  component: Cart,
});

function Cart() {
  const { items, subtotal, count, clear } = useBag();

  return (
    <section className="pb-[clamp(64px,9vw,128px)] pt-8 md:pt-12">
      <div className="wrap">
        <h1 className="display-xl rise">
          Your <em>bag.</em>
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 grid place-items-center gap-4 rounded-[var(--radius-card)] bg-bg-2 px-6 py-20 text-center">
            <Handbag size={52} className="text-accent-text" aria-hidden />
            <p className="font-display text-[2rem] text-fg">Your bag is empty.</p>
            <p className="max-w-[36ch] text-muted">
              Add a shade or two and they will wait here, in this browser only.
            </p>
            <Link to="/shop" className="btn btn-primary mt-2">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              <ul className="divide-y divide-line border-y border-line">
                {items.map((line) => (
                  <BagLine key={line.key} line={line} />
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Link to="/shop" className="btn-text">
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-muted underline underline-offset-4 hover:text-accent-text"
                >
                  Empty the bag
                </button>
              </div>
            </div>

            <aside className="card h-fit p-6 sm:p-8 lg:sticky lg:top-28" aria-label="Order summary">
              <h2 className="font-display text-[1.7rem]">Summary</h2>
              <dl className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted">Items ({count})</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping and tax</dt>
                  <dd className="font-semibold">Not calculated</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-bold">Subtotal</dt>
                  <dd className="font-display text-[2rem] text-fg">{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <Link to="/checkout" className="btn btn-primary mt-6 w-full">
                Go to demo checkout
              </Link>
              <p className="mt-4 text-sm text-muted">
                Sample prices on a fictional store. The next step is a demonstration: no card is
                taken and no order is placed.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

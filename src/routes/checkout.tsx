import { Info } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { describeSelections, formatPrice } from "@/data/products";
import { useBag } from "@/lib/bag";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () =>
    seo({
      title: "Demo Checkout | VELORA BEAUTY",
      description: "A demonstration checkout screen. No payment is taken and no order is placed.",
      image: "checkout",
    }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal } = useBag();
  const [finished, setFinished] = useState(false);

  return (
    <section className="pb-[clamp(64px,9vw,128px)] pt-8 md:pt-12">
      <div className="wrap max-w-5xl">
        <h1 className="display-xl rise">
          Demo <em>checkout.</em>
        </h1>

        <div
          role="note"
          className="mt-8 flex gap-4 rounded-[var(--radius-card)] border-2 border-fg bg-bg-2 p-5 sm:p-6"
        >
          <Info size={28} className="mt-0.5 shrink-0 text-accent-text" aria-hidden />
          <div>
            <h2 className="font-display text-[1.4rem]">This is a demonstration.</h2>
            <p className="mt-1 max-w-[62ch] text-fg/85">
              VELORA is a fictional brand. This screen has no payment form on purpose: no card,
              address or personal details are asked for, nothing is charged, and no order is placed.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-display text-[1.8rem] text-fg">There is nothing to check out.</p>
            <Link to="/shop" className="btn btn-primary mt-5">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <h2 className="font-display text-[1.7rem]">Your items</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {items.map((l) => {
                  const detail = describeSelections(l.product, l.selections);
                  return (
                    <li key={l.key} className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <p className="font-semibold text-fg">
                          {l.product.name} <span className="font-normal text-muted">× {l.qty}</span>
                        </p>
                        {detail && <p className="text-sm text-muted">{detail}</p>}
                      </div>
                      <p className="font-bold">{formatPrice(l.lineTotal)}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4">
                <Link to="/cart" className="btn-text">
                  Edit your bag
                </Link>
              </p>
            </div>

            <aside className="card h-fit p-6 sm:p-8" aria-label="Demo order summary">
              <h2 className="font-display text-[1.7rem]">Order summary</h2>
              <dl className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping and tax</dt>
                  <dd className="font-semibold">Not calculated</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-bold">Total (sample)</dt>
                  <dd className="font-display text-[2rem] text-fg">{formatPrice(subtotal)}</dd>
                </div>
              </dl>

              {finished ? (
                <div role="status" className="pop mt-6 rounded-2xl bg-bg-2 p-4">
                  <p className="font-bold text-fg">Demo complete. Nothing was ordered.</p>
                  <p className="mt-1 text-sm text-muted">
                    No payment was taken and no order exists. Your bag is unchanged.
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-accent-text underline underline-offset-4"
                    onClick={() => setFinished(false)}
                  >
                    Run the demo again
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-solid mt-6 w-full"
                  onClick={() => setFinished(true)}
                >
                  Finish demo checkout
                </button>
              )}
              <Link to="/shop" className="btn btn-ghost mt-3 w-full">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

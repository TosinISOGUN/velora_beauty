import { Check, Handbag } from "@phosphor-icons/react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Faq } from "@/components/faq";
import { ProductGallery } from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { ShadeSelector } from "@/components/shade-selector";
import {
  PRODUCTS,
  formatPrice,
  getProductBySlug,
  missingGroups,
  packagingHex,
  selectedOption,
  type Selections,
} from "@/data/products";
import { ADD_CTA } from "@/data/site";
import { useBag } from "@/lib/bag";
import { seo } from "@/lib/seo";
import { TILE } from "@/lib/style";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: `${loaderData.name} | VELORA BEAUTY`,
          description: `${loaderData.short} Sample price ${formatPrice(loaderData.price)}. A fictional beauty concept.`,
          image: loaderData.slug,
        })
      : {},
  component: ProductPage,
});

const SAMPLE_SHIPPING = (
  <div className="space-y-3">
    <p>
      This is sample policy text for a fictional brand. A real store would state delivery times,
      carriers and costs here, and nothing is shipped in this concept.
    </p>
    <p>
      Returns would also be described here: how long you have, what condition products must be in,
      and how refunds are issued. No orders are placed on this site, so there is nothing to return.
    </p>
  </div>
);

function ProductPage() {
  const product = Route.useLoaderData();
  const { addItem } = useBag();
  const [selections, setSelections] = useState<Selections>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [justAdded, setJustAdded] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Reset choices when navigating between products.
  useEffect(() => {
    setSelections({});
    setErrors({});
    setJustAdded(false);
  }, [product.slug]);

  // The mobile bar appears only while neither the options nor the main button are on screen,
  // so it can never cover the shade selector.
  useEffect(() => {
    const targets: Element[] = [];
    if (buyRef.current) targets.push(buyRef.current);
    if (optionsRef.current) targets.push(optionsRef.current);
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setBarVisible(visible.size === 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [product.slug]);

  const hex = packagingHex(product, selections);
  const hex2 =
    product.slug === "the-daily-edit-set"
      ? selectedOption(product, "blush", selections)?.hex
      : undefined;
  const isSet = product.category === "set";

  function choose(groupId: string, optionId: string) {
    setSelections((prev) => ({ ...prev, [groupId]: optionId }));
    setErrors((prev) => {
      const { [groupId]: _removed, ...rest } = prev;
      return rest;
    });
    setJustAdded(false);
  }

  function submit() {
    const missing = missingGroups(product, selections);
    if (missing.length > 0) {
      setErrors(
        Object.fromEntries(
          missing.map((g) => [g.id, `Choose a ${g.label.toLowerCase()} to add this to your bag.`]),
        ),
      );
      const first = missing[0];
      const target =
        first && document.querySelector<HTMLInputElement>(`input[name="opt-${first.id}"]`);
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
      target?.focus({ preventScroll: true });
      return;
    }
    const result = addItem(product, selections);
    if (result.ok) setJustAdded(true);
  }

  const others = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <div className="wrap pt-4 text-sm font-semibold text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link to="/shop" className="inline-flex min-h-11 items-center hover:text-fg">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="pb-[clamp(48px,7vw,96px)] pt-2">
        <div className="wrap grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery
              name={product.name}
              mockup={product.mockup}
              hex={hex}
              hex2={hex2}
              tile={TILE[product.category]}
              photos={product.images}
            />
          </div>

          <div>
            <p className="eyebrow">{product.categoryLabel}</p>
            <h1 className="display-xl mt-2 !text-[clamp(2.4rem,5vw,4.2rem)]">{product.name}</h1>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-[2rem] text-fg">{formatPrice(product.price)}</span>
              <span className="text-sm font-semibold text-muted">
                {product.size}, sample price, in stock (demo)
              </span>
            </p>
            <p className="lead mt-4">{product.short}</p>

            <div ref={optionsRef} className="mt-8 space-y-7">
              {product.groups.map((g) => (
                <ShadeSelector
                  key={g.id}
                  name={`opt-${g.id}`}
                  group={g}
                  value={selections[g.id]}
                  error={errors[g.id]}
                  onChange={(id) => choose(g.id, id)}
                />
              ))}
            </div>

            <div className="mt-8">
              <button
                ref={buyRef}
                type="button"
                onClick={submit}
                className="btn btn-primary w-full !min-h-14 text-base sm:w-auto sm:min-w-[18rem]"
              >
                <Handbag size={22} aria-hidden />
                {ADD_CTA}
              </button>
              <p className="mt-3 min-h-6 text-sm font-semibold" role="status">
                {justAdded && (
                  <span className="pop inline-flex items-center gap-2 text-fg">
                    <Check size={18} weight="bold" className="text-accent-text" aria-hidden />
                    Added to your bag.
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">
                Demo store: nothing is charged, shipped or saved anywhere except this browser.
              </p>
            </div>

            {isSet && (
              <div className="mt-8 rounded-[var(--radius-card)] bg-bg-2 p-5">
                <h2 className="font-display text-[1.3rem]">What is in the pouch</h2>
                <ul className="mt-3 space-y-1">
                  {PRODUCTS.filter((p) =>
                    [
                      "dew-drop-serum",
                      "soft-focus-cream-blush",
                      "cloud-kiss-lip-treatment",
                    ].includes(p.slug),
                  ).map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-fg hover:underline"
                      >
                        <Check size={16} weight="bold" className="text-accent-text" aria-hidden />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Faq
              className="mt-10"
              items={[
                { q: "What it is", a: <p>{product.full}</p> },
                {
                  q: "Why you'll love it",
                  a: (
                    <ul className="list-disc space-y-1.5 pl-5">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  q: "How to use it",
                  a: (
                    <ol className="list-decimal space-y-1.5 pl-5">
                      {product.howTo.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ol>
                  ),
                },
                { q: "Ingredients (sample content)", a: <p>{product.ingredients}</p> },
                { q: "Shipping and returns (sample policy)", a: SAMPLE_SHIPPING },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section bg-bg-2">
        <div className="wrap">
          <h2 className="display-lg reveal max-w-[16ch]">Pair it with</h2>
          <div className="mt-10">
            <ProductGrid products={others} />
          </div>
        </div>
      </section>

      {/* Compact purchase bar for phones, shown only when it cannot cover the options or the main button */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${
          barVisible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!barVisible}
        inert={!barVisible}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-[1.05rem] leading-tight text-fg">
              {product.name}
            </p>
            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
          </div>
          <button type="button" onClick={submit} className="btn btn-primary shrink-0">
            {ADD_CTA}
          </button>
        </div>
      </div>
    </>
  );
}

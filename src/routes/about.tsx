import { ArrowRight } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Img } from "@/components/img";
import { ProductMockup } from "@/components/product-mockup";
import { PRODUCTS } from "@/data/products";
import { CONCEPT_NOTE, SHOP_CTA } from "@/data/site";
import { seo } from "@/lib/seo";
import { delay } from "@/lib/style";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "Our Story | VELORA BEAUTY",
      description:
        "Beauty was never one-size-fits-all. The idea behind VELORA, a fictional skin-first color label for everyday personal expression.",
      image: "about",
    }),
  component: About,
});

const beliefs = [
  {
    title: "Color is optional",
    text: "Wear a lot, a little, or none. Every product is made to work on its own, so nothing needs a full routine around it.",
  },
  {
    title: "Skin comes first",
    text: "Textures are light and comfortable, and tints let freckles and real skin show through.",
  },
  {
    title: "Plain words",
    text: "Shades have names, notes and undertones you can read. We say what a product is and leave the miracles out.",
  },
];

const SURFACE = {
  lips: "bg-s-lips",
  cheeks: "bg-s-cheeks",
  complexion: "bg-s-complexion",
  set: "bg-s-set",
} as const;

function About() {
  const showcase = PRODUCTS.filter((p) =>
    ["cloud-kiss-lip-treatment", "soft-focus-cream-blush", "skin-veil-tint"].includes(p.slug),
  );

  return (
    <>
      <section className="pb-4 pt-8 md:pt-12">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h1 className="display-2xl rise !text-[clamp(2.8rem,8vw,7rem)]">
              Beauty was never <em>one-size-fits-all.</em>
            </h1>
            <p className="lead rise mt-7" style={delay(1)}>
              VELORA is a fictional label with a simple point of view: beauty is how you express
              yourself, not a list of things to correct.
            </p>
          </div>
          <div className="settle relative mx-auto w-full max-w-[28rem] pb-12 lg:max-w-none">
            <div className="arch shadow-[var(--shadow)]">
              <Img
                id="aboutProfile"
                alt="Two women laughing together, cheek to cheek"
                sizes="(min-width: 1024px) 36vw, 90vw"
                priority
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="media absolute -bottom-0 -left-4 w-[42%] border-[6px] border-bg shadow-[var(--shadow)] lg:-left-10">
              <Img
                id="aboutMoody"
                alt="A woman in a patterned robe looking away while her makeup is finished"
                sizes="(min-width: 1024px) 16vw, 40vw"
                priority
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="display-lg reveal max-w-[12ch]">What we mean by that</h2>
          <div className="prose-flow reveal text-[1.1rem]">
            <p>
              Most beauty advice arrives as rules: the right shade for your type, the right order
              for your day, the right look for your age. VELORA starts from the opposite place. The
              people who wear makeup are the experts on their own faces.
            </p>
            <p>
              So the collection is small on purpose. Six pieces that cover lips, cheeks and
              complexion, each one easy to understand, comfortable to wear, and simple to mix with
              the others.
            </p>
            <p>
              A good routine is the one you will actually do. For some people that is five minutes
              with a mirror. For others it is a balm in a jacket pocket and a swipe of color on the
              way out.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-bg-2">
        <div className="wrap">
          <h2 className="display-lg reveal max-w-[14ch]">What we believe</h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-fg/20">
            {beliefs.map((b) => (
              <li key={b.title} className="reveal md:px-8 md:first:pl-0 md:last:pr-0">
                <h3 className="font-display text-[1.9rem]">{b.title}</h3>
                <p className="mt-3 max-w-[34ch] text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section overflow-hidden">
        <div className="wrap">
          <div className="reveal grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="media">
              <Img
                id="routineMirror"
                alt="A woman in a beige headscarf applying lipstick, seen in a hand mirror"
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div>
              <h2 className="display-lg max-w-[14ch]">
                Little rituals, <em>your way.</em>
              </h2>
              <p className="lead mt-5">
                Serum before color. Blush on the cheekbones. A lip treatment you reapply without
                thinking. Start where you like and stop when you like.
              </p>
              <Link to="/routine" className="btn-text mt-3">
                Build a routine <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[clamp(64px,9vw,128px)]">
        <div className="wrap">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-lg max-w-[16ch]">A first look at the collection</h2>
            <Link to="/shop" className="btn btn-primary">
              {SHOP_CTA}
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {showcase.map((p) => (
              <li key={p.slug} className="reveal">
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className={`group grid aspect-[4/3] place-items-center rounded-[var(--radius-card)] ${SURFACE[p.category]}`}
                >
                  <ProductMockup
                    kind={p.mockup}
                    hex={p.mockupHex}
                    className="h-[78%] w-auto transition-transform duration-500 group-hover:-translate-y-1"
                  />
                  <span className="sr-only">{p.name}</span>
                </Link>
                <p className="mt-3 font-display text-[1.4rem] text-fg">{p.name}</p>
                <p className="text-sm text-muted">{p.tagline}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[64ch] text-sm text-muted">
            {CONCEPT_NOTE} There is no founder story, factory or testing programme described here
            because none exists; anything of that kind on a real brand&rsquo;s site would be labeled
            here as concept content.
          </p>
        </div>
      </section>
    </>
  );
}

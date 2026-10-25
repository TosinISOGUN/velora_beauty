import { ArrowRight, Check } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";

import { Img } from "@/components/img";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductGrid } from "@/components/product-grid";
import { ProductMockup } from "@/components/product-mockup";
import {
  PRODUCTS,
  formatPrice,
  getProductBySlug,
  type Product,
  type Selections,
} from "@/data/products";
import type { ImageId } from "@/data/images.generated";
import { SHOP_CTA, STORY_CTA } from "@/data/site";
import { useBag } from "@/lib/bag";
import { preloadImage } from "@/lib/preload";
import { seo } from "@/lib/seo";
import { delay } from "@/lib/style";

export const Route = createFileRoute("/")({
  loader: () => {
    preloadImage("heroCampaign", "100vw");
  },
  head: () =>
    seo({
      title: "VELORA BEAUTY | Beauty that feels like you",
      description:
        "Skin-first makeup, everyday color, and little rituals that feel like you. Shop the debut VELORA collection, a fictional beauty concept.",
      image: "home",
    }),
  component: Home,
});

const edit = [
  "skin-veil-tint",
  "soft-focus-cream-blush",
  "cloud-kiss-lip-treatment",
  "dew-drop-serum",
]
  .map((slug) => getProductBySlug(slug))
  .filter((p): p is Product => Boolean(p));

const mirror: (string | { pill: ImageId; focus: string })[] = [
  "Made",
  "for",
  "your",
  { pill: "portraitWarm", focus: "50% 30%" },
  "mirror.",
  "And",
  { pill: "portraitDeep", focus: "50% 25%" },
  "everywhere",
  "beyond",
  { pill: "portraitFreckles", focus: "50% 35%" },
  "it.",
];

const tiles = [
  {
    slug: "lips",
    name: "Lips",
    image: "tileLips",
    alt: "Close-up of a red lipstick being applied to a woman's lips against a purple backdrop",
    focus: "42% 60%",
  },
  {
    slug: "cheeks",
    name: "Cheeks",
    image: "tileCheeks",
    alt: "A makeup brush sweeping peach blush across a cheek",
    focus: "70% 50%",
  },
  {
    slug: "complexion",
    name: "Complexion",
    image: "tileComplexion",
    alt: "A woman with dark hair smoothing white cream onto her cheek against a navy wall",
    focus: "50% 40%",
  },
] as const;

const ritual = [
  {
    slug: "dew-drop-serum",
    label: "Prep",
    image: "routineReset",
    alt: "A woman in a towel wrap and white robe with under-eye patches, glancing at her phone",
    text: "Press a few drops into clean skin and give it a minute to settle.",
  },
  {
    slug: "soft-focus-cream-blush",
    label: "Add color",
    image: "portraitFreckles2",
    alt: "A woman in profile with a makeup brush sweeping blush along her cheek",
    text: "Tap cream blush onto the apples of your cheeks and blend up and out.",
  },
  {
    slug: "cloud-kiss-lip-treatment",
    label: "Finish",
    image: "textureGloss",
    alt: "A gloss applicator touching a woman's lips, her fingertips painted red",
    text: "One swipe for a wash of color, three for a statement.",
  },
] as const;

const RITUAL_SHADES: Record<string, Selections> = {
  "soft-focus-cream-blush": { shade: "peony" },
  "cloud-kiss-lip-treatment": { shade: "cherry-silk" },
};

const portraits: { image: ImageId; alt: string; ratio: string }[] = [
  {
    image: "portraitDeep",
    alt: "A woman with her hair in an updo, a hoop earring and a flick of green liner, against a teal wall",
    ratio: "aspect-[3/4]",
  },
  {
    image: "aboutMoody",
    alt: "A woman in a patterned robe looking away while her makeup is finished",
    ratio: "aspect-[4/5]",
  },
  {
    image: "portraitFreckles",
    alt: "A woman with warm coral blush and soft eyeshadow looking into the camera",
    ratio: "aspect-[4/3]",
  },
  {
    image: "portraitRed",
    alt: "A woman with a sleek black bob wrapped across her face and teal eyeshadow",
    ratio: "aspect-[4/5]",
  },
  {
    image: "portraitWarm",
    alt: "A silver-haired woman in an orange blazer and red lipstick",
    ratio: "aspect-[3/4]",
  },
  {
    image: "aboutProfile",
    alt: "Two women laughing together, cheek to cheek",
    ratio: "aspect-[4/5]",
  },
];

const tickerShades = PRODUCTS.flatMap((p) => p.groups.flatMap((g) => g.options)).filter(
  (o, i, all) => all.findIndex((x) => x.name === o.name) === i,
);

const tintShades = PRODUCTS.find((p) => p.slug === "skin-veil-tint")?.groups[0]?.options ?? [];

function Home() {
  const { addMany } = useBag();
  const ritualProducts = ritual.flatMap((r) => {
    const product = getProductBySlug(r.slug);
    return product ? [{ ...r, product, selections: RITUAL_SHADES[r.slug] ?? {} }] : [];
  });
  const ritualTotal = ritualProducts.reduce((n, r) => n + r.product.price, 0);

  return (
    <>
      {/* Hero: The Color of You. One photograph fills the whole screen; the type stays out of its way. */}
      <section
        data-hero
        className="relative isolate -mt-[var(--nav-h)] flex min-h-svh flex-col justify-end overflow-hidden bg-black lg:bg-bg"
      >
        <div className="settle hero-media absolute inset-x-0 top-0 -z-10 h-[74%] [mask-image:linear-gradient(to_bottom,#000_68%,transparent)] lg:inset-0 lg:h-full lg:[mask-image:none]">
          <Img
            id="heroCampaign"
            alt="A woman with bold yellow eyeshadow, a sharp green liner flick and glossy red lips, resting her cheek on her hand against a rust-red backdrop"
            sizes="100vw"
            priority
            className="push h-full w-full object-cover object-[94%_50%] sm:object-[88%_50%] lg:object-[50%_30%]"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/5 to-black/30 lg:bg-gradient-to-r lg:from-black/30 lg:via-transparent lg:to-transparent"
        />
        <div className="hero-copy wrap relative pb-10 pt-40 sm:pb-14 lg:pb-16">
          <h1
            className="display-hero rise max-w-[10ch] !text-white lg:max-w-[15ch] [&_em]:!text-white"
            style={delay(1)}
          >
            Beauty that feels <em>like&nbsp;you.</em>
          </h1>
          <div className="rise mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" style={delay(2)}>
            <Link to="/shop" className="btn btn-on-dark !min-h-14 px-8">
              {SHOP_CTA}
            </Link>
            <Link to="/about" className="btn btn-glass !min-h-14 px-7">
              {STORY_CTA} <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Shade ticker: every sample shade name, drifting slowly. Decorative; the shades live on the product pages. */}
      <div className="ticker border-y border-line py-5" aria-hidden>
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-10 pr-10">
              {tickerShades.map((o) => (
                <li key={o.id} className="flex items-center gap-4 whitespace-nowrap">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-fg/25"
                    style={{ background: o.hex }}
                  />
                  <span className="font-display text-[clamp(1.4rem,2.4vw,2rem)] italic text-fg/85">
                    {o.name}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Brand introduction: type with portraits set inside it */}
      <section className="section">
        <div className="wrap">
          <p
            className="display max-w-[20ch] font-display text-fg lg:max-w-[18ch]"
            style={{
              fontSize: "clamp(2.3rem, 6.2vw, 5.4rem)",
              lineHeight: 1.16,
              letterSpacing: "-0.03em",
            }}
          >
            <span className="sr-only">Made for your mirror. And everywhere beyond it.</span>
            <span aria-hidden>
              {mirror.map((t, i) =>
                typeof t === "string" ? (
                  <Fragment key={i}>
                    <span
                      className={`stmt-word ${t === "mirror." || t === "it." ? "italic text-accent-text" : ""}`}
                    >
                      {t}
                    </span>{" "}
                  </Fragment>
                ) : (
                  <Fragment key={i}>
                    <span className="mx-[0.06em] inline-block h-[0.78em] w-[1.5em] overflow-hidden rounded-full align-[-0.08em]">
                      <Img
                        id={t.pill}
                        alt=""
                        sizes="160px"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: t.focus }}
                      />
                    </span>{" "}
                  </Fragment>
                ),
              )}
            </span>
          </p>
          <div className="reveal mt-10 grid gap-6 md:grid-cols-[0.55fr_0.45fr] md:items-end">
            <p className="lead">
              VELORA is a modern beauty label for people who enjoy beauty on their own terms:
              skin-first formulas, comfortable textures, and color that fits into your day instead
              of taking it over. No rules, no rituals you didn&rsquo;t choose.
            </p>
          </div>
        </div>
      </section>

      {/* Categories: three full-height panels; the one you point at opens up */}
      <section className="pb-[clamp(64px,9vw,128px)]">
        <div className="wrap">
          <div className="reveal flex items-end justify-between gap-4">
            <h2 className="display-lg">Shop by category</h2>
            <Link to="/shop" className="btn-text">
              Shop all <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
          <ul className="panels mt-10">
            {tiles.map((t) => (
              <li key={t.slug} className="reveal">
                <Link
                  to="/collections/$slug"
                  params={{ slug: t.slug }}
                  className="group relative block h-full overflow-hidden rounded-[var(--radius-card)]"
                >
                  <Img
                    id={t.image}
                    alt={t.alt}
                    sizes="(min-width: 1024px) 50vw, 92vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: t.focus }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 sm:p-8">
                    <span>
                      <span className="caps-serif block text-[0.75rem] tracking-[0.3em] text-white/80">
                        Shop {t.name.toLowerCase()}
                      </span>
                      <span className="mt-2 block font-display text-[clamp(1.8rem,2.8vw,2.5rem)] leading-none text-white">
                        {t.name}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <ArrowRight size={20} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The VELORA Edit */}
      <section className="section bg-bg-2">
        <div className="wrap">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">The VELORA Edit</p>
            <h2 className="display-lg mt-3">The ones you&rsquo;ll reach for again.</h2>
          </div>
          <div className="mt-12">
            <ProductGrid products={edit} />
          </div>
          <Link
            to="/products/$slug"
            params={{ slug: "the-daily-edit-set" }}
            className="reveal group mt-14 grid items-center gap-6 overflow-hidden rounded-[var(--radius-card)] bg-panel p-7 text-on-panel sm:grid-cols-[auto_1fr_auto] sm:p-10"
          >
            <ProductMockup kind="set" hex="#B83248" className="h-40 w-auto justify-self-center" />
            <div>
              <p className="eyebrow !text-petal">The Daily Edit Set</p>
              <p className="mt-2 font-display text-[2rem] leading-tight text-on-panel sm:text-[2.6rem]">
                Three steps, one pouch, {formatPrice(82)}.
              </p>
              <p className="mt-2 max-w-[46ch] text-on-panel/75">
                Serum, cream blush and lip treatment, with your choice of shades. Sample set price,
                below buying them one by one.
              </p>
            </div>
            <span className="btn btn-on-dark justify-self-start sm:justify-self-end">
              Build your set <ArrowRight size={18} aria-hidden />
            </span>
          </Link>
        </div>
      </section>

      {/* Campaign editorial */}
      <section className="section overflow-hidden">
        <div className="wrap">
          <div className="reveal relative grid overflow-hidden rounded-[var(--radius-card)] bg-accent text-on-accent [&_em]:!text-on-accent lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 p-7 sm:p-12 lg:p-16">
              <h2 className="display-xl !text-on-accent">
                A little color changes <em>everything.</em>
              </h2>
              <p className="mt-6 max-w-[44ch] text-[1.08rem] text-on-accent/90">
                Color doesn&rsquo;t have to be a statement, and it doesn&rsquo;t have to be small.
                It&rsquo;s whatever makes you recognize yourself in the mirror, on the days you want
                to.
              </p>
              <Link
                to="/collections/$slug"
                params={{ slug: "lips" }}
                className="btn btn-on-dark mt-9"
              >
                Shop the color collection
              </Link>
            </div>
            <div className="relative min-h-[28rem] lg:min-h-[34rem]">
              <Img
                id="editorialColor"
                alt="A woman in a red satin bow and red jacket with bright blue eyeshadow, her hand raised to her lips"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ritual */}
      <section className="pb-[clamp(64px,9vw,128px)] pt-[clamp(0px,3vw,32px)]">
        <div className="wrap">
          <div className="reveal max-w-2xl">
            <h2 className="display-lg">
              Your five-minute <em>reset.</em>
            </h2>
            <p className="lead mt-4">
              Three products, one simple order. Everything here is a real product from the
              collection.
            </p>
          </div>
          <ol className="relative mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
            <span
              aria-hidden
              className="ritual-line absolute left-0 right-0 top-[1.1rem] hidden h-px bg-fg/40 lg:block"
            />
            {ritualProducts.map((r) => (
              <li key={r.slug} className="reveal relative lg:pt-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 hidden h-[2.2rem] w-[2.2rem] place-items-center rounded-full bg-accent text-on-accent lg:grid"
                >
                  <Check size={16} weight="bold" />
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-text">
                  {r.label}
                </p>
                <div className="media relative mt-4">
                  <Img
                    id={r.image}
                    alt={r.alt}
                    sizes="(min-width: 1024px) 30vw, 92vw"
                    className="aspect-[4/3] w-full object-cover"
                    style={{ objectPosition: "50% 30%" }}
                  />
                </div>
                <div className="mt-5 flex items-start gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-bg-2">
                    <ProductMockup
                      kind={r.product.mockup}
                      hex={r.product.mockupHex}
                      className="h-14 w-auto"
                    />
                  </span>
                  <div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: r.slug }}
                      className="font-display text-[1.5rem] leading-tight text-fg hover:underline"
                    >
                      {r.product.name}
                    </Link>
                    <p className="mt-1 text-muted">{r.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="reveal mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--radius-card)] bg-bg-2 p-6 sm:p-8">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                addMany(
                  ritualProducts.map((r) => ({ product: r.product, selections: r.selections })),
                )
              }
            >
              Add all three to your bag, {formatPrice(ritualTotal)}
            </button>
            <p className="max-w-[48ch] text-sm text-muted">
              Adds the serum, the Peony blush and the Cherry Silk lip treatment. You can change
              shades on each product page, or{" "}
              <Link to="/routine" className="link-inline">
                build a routine of your own
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Inclusive beauty */}
      <section className="section bg-bg-2">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="reveal">
              <h2 className="display-lg">
                Every skin, every <em>undertone.</em>
              </h2>
              <p className="lead mt-5">
                The collection is built around a wide range of faces, not a single ideal one.
                Complexion shades run from fair to deep, in neutral and warm undertones.
              </p>
            </div>
            <div className="reveal card mt-8 p-6 sm:p-8">
              <h3 className="font-display text-[1.6rem]">How the sample shades work</h3>
              <p className="mt-2 text-muted">
                Skin Veil Tint has eight sample shades. The number runs from light to deep. The
                letter is the undertone: <strong className="text-fg">N</strong> for neutral,{" "}
                <strong className="text-fg">W</strong> for warm. This concept has no shade-matching
                tool, so we won&rsquo;t promise a perfect match.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {tintShades.map((s) => (
                  <li
                    key={s.id}
                    className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-semibold text-fg"
                  >
                    <span
                      aria-hidden
                      className="h-6 w-6 rounded-full border border-fg/25"
                      style={{ background: s.hex }}
                    />
                    {s.name}
                  </li>
                ))}
              </ul>
              <Link
                to="/products/$slug"
                params={{ slug: "skin-veil-tint" }}
                className="btn-text mt-3"
              >
                See Skin Veil Tint <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
          </div>
          <ul className="columns-2 gap-3 sm:gap-4 [&>li]:mb-3 sm:[&>li]:mb-4">
            {portraits.map((p) => (
              <li key={p.image} className="reveal media break-inside-avoid">
                <Img
                  id={p.image}
                  alt={p.alt}
                  sizes="(min-width: 1024px) 28vw, 46vw"
                  className={`${p.ratio} w-full object-cover`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brand story teaser */}
      <section className="section overflow-hidden">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="reveal arch mx-auto w-full max-w-[26rem] lg:max-w-none">
            <Img
              id="storyIntimate"
              alt="Two women lying head to head, looking calmly into the camera"
              sizes="(min-width: 1024px) 34vw, 90vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="reveal">
            <h2 className="display-xl max-w-[12ch]">
              Not more rules. More room to <em>be you.</em>
            </h2>
            <div className="prose-flow mt-7 text-[1.08rem]">
              <p>
                Beauty gets sold as a list of things to fix. VELORA starts somewhere else: with
                products that are easy to understand, comfortable to wear, and made for the way you
                already move through your day.
              </p>
              <p>
                Pick one product or all six. Wear color on Monday and none on Tuesday. It&rsquo;s
                your face, and you decide what it&rsquo;s for.
              </p>
            </div>
            <Link to="/about" className="btn btn-solid mt-9">
              Meet VELORA
            </Link>
          </div>
        </div>
      </section>

      {/* Email sign-up */}
      <section className="pb-[clamp(64px,9vw,128px)]">
        <div className="wrap">
          <div className="reveal relative overflow-hidden rounded-[var(--radius-card)] bg-bg-2 px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
            <span
              aria-hidden
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/80"
            />
            <span
              aria-hidden
              className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-accent/30"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h2 className="display-xl max-w-[12ch]">A little beauty in your inbox.</h2>
                <p className="mt-5 max-w-[44ch] text-muted">
                  Get first looks at new drops, beauty notes, and the occasional reason to treat
                  yourself.
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-panel p-6 shadow-[var(--shadow)] sm:p-8">
                <NewsletterForm tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

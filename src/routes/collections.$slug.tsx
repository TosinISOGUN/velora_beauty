import { createFileRoute, notFound } from "@tanstack/react-router";

import { CatalogView } from "@/components/catalog-view";
import { PageHero } from "@/components/page-hero";
import { CATEGORIES, productsByCategory } from "@/data/products";
import type { ImageId } from "@/data/images.generated";
import { DEFAULT_FILTERS, parseFilters, toSearch } from "@/lib/catalog";
import { preloadImage } from "@/lib/preload";
import { seo } from "@/lib/seo";

/** Each collection gets its own photograph and notes, so the pages differ in more than the heading. */
const PAGE: Record<
  string,
  {
    image: ImageId;
    alt: string;
    focus: string;
    notes: { title: string; text: string }[];
  }
> = {
  lips: {
    image: "tileLips",
    alt: "Close-up of a red lipstick being applied to a woman's lips against a purple backdrop",
    focus: "50% 62%",
    notes: [
      { title: "Wear it bare", text: "One swipe on clean lips gives a glossy wash of color." },
      { title: "Layer it", text: "Add more at the center for a fuller look, or go over liner." },
      { title: "Five shades", text: "From Clear Glow to Fig Noir, named and described in words." },
    ],
  },
  cheeks: {
    image: "tileCheeks",
    alt: "A makeup brush sweeping peach blush across a cheek",
    focus: "60% 45%",
    notes: [
      {
        title: "Fingertips first",
        text: "Tap on cream blush, then blend up and out toward the temples.",
      },
      {
        title: "Build it",
        text: "Stays blendable for about a minute, so you can go softer or stronger.",
      },
      { title: "Five shades", text: "Cool, warm and neutral flushes, from Shell to Berry." },
    ],
  },
  complexion: {
    image: "tileComplexion",
    alt: "A woman with dark hair smoothing white cream onto her cheek against a navy wall",
    focus: "50% 38%",
    notes: [
      {
        title: "Skin stays visible",
        text: "The tint evens tone without hiding freckles or texture.",
      },
      {
        title: "Eight sample shades",
        text: "Fair to deep, neutral and warm. The letter is the undertone.",
      },
      { title: "Prep and finish", text: "A serum before color and a balm for everywhere else." },
    ],
  },
};

export const Route = createFileRoute("/collections/$slug")({
  validateSearch: (search: Record<string, unknown>) => toSearch(parseFilters(search)),
  loader: ({ params }) => {
    const category = CATEGORIES.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    const page = PAGE[category.slug];
    if (page) preloadImage(page.image, "100vw");
    return category;
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: `${loaderData.name} | VELORA BEAUTY`,
          description: `${loaderData.blurb} Shop the VELORA ${loaderData.name.toLowerCase()} collection, a fictional beauty concept.`,
          image: loaderData.slug,
        })
      : {},
  component: Collection,
});

function Collection() {
  const category = Route.useLoaderData();
  const filters = { ...parseFilters(Route.useSearch()), category: DEFAULT_FILTERS.category };
  const navigate = Route.useNavigate();
  const page = PAGE[category.slug]!;

  return (
    <>
      <PageHero
        image={page.image}
        alt={page.alt}
        focus={page.focus}
        eyebrow={`Collection, ${category.name}`}
        title={category.name}
        text={category.intro}
      />

      <section className="pb-[clamp(64px,9vw,128px)] pt-4">
        <div className="wrap">
          <CatalogView
            filters={filters}
            lockedCategory
            products={productsByCategory(category.slug)}
            onChange={(f) => void navigate({ search: toSearch(f), replace: true })}
          />
        </div>
      </section>

      <section className="border-t border-line py-14">
        <div className="wrap">
          <ul className="grid gap-8 md:grid-cols-3">
            {page.notes.map((n) => (
              <li key={n.title} className="reveal">
                <h2 className="font-display text-[1.6rem]">{n.title}</h2>
                <p className="mt-2 max-w-[36ch] text-muted">{n.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

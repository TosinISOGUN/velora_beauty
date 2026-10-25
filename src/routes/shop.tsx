import { createFileRoute } from "@tanstack/react-router";

import { CatalogView } from "@/components/catalog-view";
import { PageHero } from "@/components/page-hero";
import { parseFilters, toSearch } from "@/lib/catalog";
import { preloadImage } from "@/lib/preload";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  loader: () => {
    preloadImage("galleryLipsApp", "100vw");
  },
  validateSearch: (search: Record<string, unknown>) => toSearch(parseFilters(search)),
  head: () =>
    seo({
      title: "Shop the Collection | VELORA BEAUTY",
      description:
        "Six demo products: a lip treatment, cream blush, skin tint, serum, balm and a set. Filter by category and price. A fictional beauty concept.",
      image: "shop",
    }),
  component: Shop,
});

function Shop() {
  const filters = parseFilters(Route.useSearch());
  const navigate = Route.useNavigate();

  return (
    <>
      <PageHero
        image="galleryLipsApp"
        alt="A woman with graphic yellow and green eyeliner and glossy red lips, resting her head on her hand"
        focus="50% 58%"
        eyebrow="The collection"
        title={
          <>
            The whole <em>collection.</em>
          </>
        }
        text="Six everyday pieces, one visual world. Sample prices, shades you can read as well as see."
      />
      <section className="pb-[clamp(64px,9vw,128px)] pt-4">
        <div className="wrap">
          <CatalogView
            filters={filters}
            onChange={(f) => void navigate({ search: toSearch(f), replace: true })}
          />
        </div>
      </section>
    </>
  );
}

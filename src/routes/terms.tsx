import { createFileRoute } from "@tanstack/react-router";

import { CONCEPT_NOTE } from "@/data/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms of Use | VELORA BEAUTY",
      description: "The terms for viewing this fictional beauty brand concept.",
      image: "terms",
    }),
  component: Terms,
});

function Terms() {
  return (
    <section className="pb-[clamp(64px,9vw,128px)] pt-8 md:pt-12">
      <div className="wrap max-w-3xl">
        <h1 className="display-xl rise">
          Terms of <em>use.</em>
        </h1>
        <p className="lead mt-5">{CONCEPT_NOTE}</p>
        <div className="prose-flow mt-10 text-[1.05rem]">
          <h2 className="font-display text-[1.7rem] text-fg">This is a concept</h2>
          <p>
            VELORA BEAUTY does not exist as a business. The products, prices, shades, ingredient
            lists and policies shown here are sample content written for a portfolio design. Nothing
            on this site is an offer to sell, and nothing can be bought.
          </p>
          <h2 className="font-display text-[1.7rem] text-fg">No claims</h2>
          <p>
            Product descriptions are fictional and make no claim about real-world performance,
            safety, testing or certification. Do not rely on anything here to choose a real cosmetic
            product.
          </p>
          <h2 className="font-display text-[1.7rem] text-fg">Photographs</h2>
          <p>
            The photographs are stock images chosen to show the look and feel of the concept. They
            do not depict customers or endorse any product. The packaging shown is an illustration,
            not a photograph of a real product.
          </p>
        </div>
      </div>
    </section>
  );
}

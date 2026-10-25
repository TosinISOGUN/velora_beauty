import { createFileRoute } from "@tanstack/react-router";

import { RoutineBuilder } from "@/components/routine-builder";
import { seo } from "@/lib/seo";
import { delay } from "@/lib/style";

export const Route = createFileRoute("/routine")({
  head: () =>
    seo({
      title: "Build a Routine | VELORA BEAUTY",
      description:
        "Answer up to three short questions and get a simple selection from the six VELORA demo products. No account, no photos.",
      image: "routine",
    }),
  component: Routine,
});

function Routine() {
  return (
    <section className="pb-[clamp(64px,9vw,128px)] pt-8 md:pt-12">
      <div className="wrap">
        <div className="mx-auto max-w-3xl">
          <h1 className="display-xl rise">
            Build your <em>routine.</em>
          </h1>
          <p className="lead rise mt-5" style={delay(1)}>
            Up to three quick questions, two of them optional. You get a short selection of real
            products, and you can add them to your bag in one tap.
          </p>
        </div>
        <div className="mt-12">
          <RoutineBuilder />
        </div>
        <p className="mx-auto mt-14 max-w-3xl text-sm text-muted">
          This is a simple product finder, not a skin analysis. It does not ask for photos or
          personal details and gives no skincare or medical advice.
        </p>
      </div>
    </section>
  );
}

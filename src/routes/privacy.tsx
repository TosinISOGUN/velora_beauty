import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Notice | VELORA BEAUTY",
      description:
        "What this demonstration site stores in your browser, and what it does not collect.",
      image: "privacy",
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="pb-[clamp(64px,9vw,128px)] pt-8 md:pt-12">
      <div className="wrap max-w-3xl">
        <h1 className="display-xl rise">
          Privacy <em>notice.</em>
        </h1>
        <p className="lead mt-5">
          VELORA BEAUTY is a fictional concept, so this page describes exactly what the
          demonstration does, not a real company&rsquo;s data practices.
        </p>
        <div className="prose-flow mt-10 text-[1.05rem]">
          <h2 className="font-display text-[1.7rem] text-fg">What stays in your browser</h2>
          <p>
            Your bag is saved in this browser&rsquo;s local storage so it survives a page reload. It
            holds only the product, the shade you picked and the quantity. It is never sent to a
            server and you can remove it by emptying the bag or clearing site data.
          </p>
          <h2 className="font-display text-[1.7rem] text-fg">What is not collected</h2>
          <p>
            The email sign-up and the contact form check what you type and show a demo message. They
            do not send, store or log anything, so the addresses and messages you enter are
            discarded. The site sets no tracking cookies, runs no analytics and loads nothing from
            third parties.
          </p>
          <h2 className="font-display text-[1.7rem] text-fg">Checkout</h2>
          <p>
            The checkout screen is a demonstration. It asks for no card, address or personal
            details.
          </p>
          <h2 className="font-display text-[1.7rem] text-fg">Questions</h2>
          <p>
            There is no company behind this site and no one to answer privacy requests. If you are
            evaluating the design and have a question about how it was built, use the contact
            details of the person who shared it with you.
          </p>
        </div>
      </div>
    </section>
  );
}

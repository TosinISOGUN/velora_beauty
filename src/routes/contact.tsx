import { createFileRoute } from "@tanstack/react-router";

import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { site } from "@/data/site";
import { seo } from "@/lib/seo";
import { delay } from "@/lib/style";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact and FAQ | VELORA BEAUTY",
      description:
        "Questions about choosing a product or a shade, and where shipping information would appear. A demonstration contact form for a fictional brand.",
      image: "contact",
    }),
  component: Contact,
});

const faqs = [
  {
    q: "How do I choose a product?",
    a: "Start with what you reach for most. If it is color, begin with the lip treatment or cream blush. If it is skin, begin with the serum or the tint. The routine builder turns a few quick answers into a short list from the six demo products.",
  },
  {
    q: "How do I choose a shade?",
    a: "Every shade is named, with a note about its tone, so you are never choosing from a dot of color alone. Skin Veil Tint numbers run from light to deep, and the letter shows the undertone: N for neutral, W for warm. There is no shade-matching tool in this concept, so treat the notes as a guide, not a guarantee.",
  },
  {
    q: "Where would shipping information appear?",
    a: "On every product page, under Shipping and returns, and in the bag. In this concept it is sample text only: nothing ships and no order is ever placed.",
  },
  {
    q: "How do I contact the brand?",
    a: "Use the form on this page. It is a demonstration, so the message is not sent anywhere. VELORA has no real inbox, phone line or address.",
  },
];

function Contact() {
  return (
    <>
      <section className="pb-4 pt-8 md:pt-12">
        <div className="wrap">
          <h1 className="display-xl rise max-w-[14ch]">
            Questions, <em>answered.</em>
          </h1>
          <p className="lead rise mt-5" style={delay(1)}>
            Browse the common questions first, or try the demo contact form.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="display-md reveal mb-6">Common questions</h2>
            <Faq items={faqs} className="reveal" />
          </div>
          <div className="reveal">
            <h2 className="display-md mb-6">Send a message</h2>
            <ContactForm />
            <p className="mt-6 text-sm text-muted">
              The address {site.email} is a reserved placeholder and cannot receive mail.
            </p>
          </div>
        </div>
      </section>

      <section id="shipping" className="border-t border-line bg-bg-2 py-16">
        <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="display-md">Shipping and returns (sample policy)</h2>
          <div className="prose-flow">
            <p>
              This is demonstration copy for a fictional store. A real brand would list delivery
              times, carriers, costs and countries here. VELORA ships nothing, so there are no real
              delivery promises.
            </p>
            <p>
              Returns would be described here too: how many days you have, what condition products
              must be in, and how refunds are handled. No orders exist in this concept, so there is
              nothing to return.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

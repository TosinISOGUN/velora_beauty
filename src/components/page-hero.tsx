import type { ReactNode } from "react";

import type { ImageId } from "@/data/images.generated";
import { delay } from "@/lib/style";

import { Img } from "./img";

type Props = {
  image: ImageId;
  alt: string;
  /** CSS object-position for the photograph, so the face stays clear of the type. */
  focus?: string;
  eyebrow: string;
  title: ReactNode;
  text: string;
};

/**
 * Page opener, built like the home hero: one photograph fills the whole band, and a short block of
 * type sits bottom-left over a soft scrim. Runs under the transparent header.
 */
export function PageHero({ image, alt, focus = "50% 40%", eyebrow, title, text }: Props) {
  return (
    <section
      data-hero
      className="relative isolate -mt-[var(--nav-h)] flex min-h-[min(36rem,78svh)] flex-col justify-end overflow-hidden bg-bg"
    >
      <div className="settle hero-media absolute inset-0 -z-10">
        <Img
          id={image}
          alt={alt}
          sizes="100vw"
          priority
          className="push h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/40 lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent"
      />
      <div className="hero-copy wrap relative pb-10 pt-36 sm:pb-14">
        <p className="caps-serif rise mb-4 text-[0.8rem] tracking-[0.34em] text-white/90">
          {eyebrow}
        </p>
        <h1
          className="display-hero rise max-w-[12ch] !text-white [&_em]:!text-white"
          style={delay(1)}
        >
          {title}
        </h1>
        <p className="lead rise mt-5 max-w-[36ch] !text-white/90" style={delay(2)}>
          {text}
        </p>
      </div>
    </section>
  );
}

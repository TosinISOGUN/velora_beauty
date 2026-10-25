import { ArrowLeft, ArrowRight, MagnifyingGlassPlus, Pause, Play, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { ProductImage } from "@/data/products";

import { Img } from "./img";
import { ProductMockup } from "./product-mockup";
import { Sheet } from "./sheet";
import type { MockupKind } from "@/data/products";

type Props = {
  name: string;
  mockup: MockupKind;
  hex: string;
  hex2?: string | undefined;
  /** Category ground colour (a CSS value), lit from within by the packaging shade. */
  tile: string;
  photos: ProductImage[];
};

/**
 * Product gallery. The first slide is the packaging illustration in the chosen shade, followed by
 * photographs. It advances by itself and loops from the last slide back to the first; it pauses on
 * hover, focus, touch, a hidden tab, an open lightbox or when scrolled out of view, and has a visible
 * pause button (and starts paused for people who prefer reduced motion). It also swipes on touch
 * (scroll snapping), has thumbnail buttons, and photographs open in a lightbox for a closer look.
 */
const AUTOPLAY_MS = 4500;

export function ProductGallery({ name, mockup, hex, hex2, tile, photos }: Props) {
  const row = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const total = photos.length + 1;
  const current = useRef(0);
  const holds = useRef({ pointer: false, focus: false, visible: true, until: 0 });
  const frame = useRef<HTMLDivElement>(null);

  /** Moves to a slide, wrapping past either end. A wrap jumps and fades instead of rewinding. */
  function go(i: number) {
    const el = row.current;
    if (!el) return;
    const next = ((i % total) + total) % total;
    const wrapped = Math.abs(next - current.current) > 1;
    el.scrollTo({ left: next * el.clientWidth, behavior: wrapped ? "auto" : "smooth" });
    if (wrapped)
      el.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 600, easing: "ease-out" });
    current.current = next;
    setIndex(next);
  }

  // Start paused when the person prefers reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // Only run while the gallery is on screen.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      holds.current.visible = entry?.isIntersecting ?? true;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || total < 2) return;
    const timer = window.setInterval(() => {
      const h = holds.current;
      if (h.pointer || h.focus || !h.visible || document.hidden) return;
      if (zoom !== null || Date.now() < h.until) return;
      go(current.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, total, zoom]);

  /** A person choosing a slide holds the slideshow for a while. */
  function choose(i: number) {
    holds.current.until = Date.now() + 10000;
    go(i);
  }

  const zoomPhoto = zoom !== null ? photos[zoom] : undefined;

  return (
    <div>
      <div
        ref={frame}
        className="relative"
        onPointerEnter={() => (holds.current.pointer = true)}
        onPointerLeave={() => (holds.current.pointer = false)}
        onFocusCapture={() => (holds.current.focus = true)}
        onBlurCapture={() => (holds.current.focus = false)}
      >
        <ul
          ref={row}
          className="snap-row gap-0 rounded-[var(--radius-card)]"
          aria-label={`${name} images`}
          aria-live={playing ? "off" : "polite"}
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            current.current = i;
            setIndex(i);
          }}
        >
          <li className="w-full" aria-label={`Packaging illustration, slide 1 of ${total}`}>
            <div
              className="glow-tile grid aspect-[4/5] place-items-center"
              style={{ "--tile": tile, "--glow": hex } as CSSProperties}
            >
              <ProductMockup
                kind={mockup}
                hex={hex}
                {...(hex2 ? { hex2 } : {})}
                className="h-[74%] w-auto -translate-y-4 drop-shadow-[0_30px_30px_rgb(0_0_0/0.45)]"
                label={`${name} packaging illustration`}
              />
            </div>
          </li>
          {photos.map((p, i) => (
            <li
              key={p.image}
              className="relative w-full"
              aria-label={`Photo, slide ${i + 2} of ${total}`}
            >
              <Img
                id={p.image}
                alt={p.alt}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setZoom(i)}
                aria-label={`Enlarge photo ${i + 1}: ${p.alt}`}
                aria-haspopup="dialog"
                className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center glass rounded-full transition-transform hover:scale-105"
              >
                <MagnifyingGlassPlus size={22} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        {total > 1 && (
          <>
            <p className="caps-serif glass pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.72rem] tracking-[0.24em]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="glass absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-105"
            >
              {playing ? (
                <Pause size={18} weight="fill" aria-hidden />
              ) : (
                <Play size={18} weight="fill" aria-hidden />
              )}
            </button>
            <ul
              className="glass absolute bottom-4 left-4 flex gap-2 rounded-full p-1.5"
              aria-label="Choose an image"
            >
              {Array.from({ length: total }, (_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    aria-label={`Show image ${i + 1} of ${total}`}
                    aria-current={index === i ? "true" : undefined}
                    className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 transition-colors ${
                      index === i ? "border-fg" : "border-transparent hover:border-line"
                    }`}
                  >
                    {i === 0 ? (
                      <ProductMockup
                        kind={mockup}
                        hex={hex}
                        {...(hex2 ? { hex2 } : {})}
                        className="h-9 w-auto"
                      />
                    ) : (
                      <Img
                        id={photos[i - 1]!.image}
                        alt=""
                        sizes="48px"
                        priority
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {total > 1 && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-3 lg:flex">
            <button
              type="button"
              onClick={() => choose(index - 1)}
              aria-label="Previous image"
              className="pointer-events-auto glass grid h-11 w-11 place-items-center rounded-full"
            >
              <ArrowLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => choose(index + 1)}
              aria-label="Next image"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full glass"
            >
              <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        )}
      </div>

      <Sheet open={zoom !== null} onClose={() => setZoom(null)} side="full" label="Photo viewer">
        {zoomPhoto && zoom !== null && (
          <div className="relative grid h-full place-items-center p-4">
            <button
              type="button"
              onClick={() => setZoom(null)}
              aria-label="Close photo viewer"
              className="absolute right-3 top-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-bg text-fg"
            >
              <X size={24} aria-hidden />
            </button>
            <Img
              id={zoomPhoto.image}
              alt={zoomPhoto.alt}
              sizes="100vw"
              className="max-h-[88dvh] w-auto max-w-full rounded-[var(--radius-card)] object-contain"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
                <button
                  type="button"
                  className="btn btn-on-dark"
                  onClick={() => setZoom((zoom + photos.length - 1) % photos.length)}
                >
                  <ArrowLeft size={18} aria-hidden /> Previous
                </button>
                <button
                  type="button"
                  className="btn btn-on-dark"
                  onClick={() => setZoom((zoom + 1) % photos.length)}
                >
                  Next <ArrowRight size={18} aria-hidden />
                </button>
              </div>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}

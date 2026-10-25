import type { CSSProperties } from "react";

import { images, type ImageId } from "@/data/images.generated";

type ImgProps = {
  id: ImageId;
  alt: string;
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
};

const srcset = (id: string, sizes: readonly number[], ext: "avif" | "webp") =>
  sizes.map((w) => `/images/${id}-${w}.${ext} ${w}w`).join(", ");

/** Responsive AVIF with WebP fallback, sized from the generated manifest so layout never shifts. */
export function Img({ id, alt, sizes, className, style, priority = false }: ImgProps) {
  const meta = images[id];
  const largest = meta.sizes[meta.sizes.length - 1]!;
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(id, meta.sizes, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(id, meta.sizes, "webp")} sizes={sizes} />
      <img
        src={`/images/${id}-${largest}.webp`}
        alt={alt}
        width={meta.w}
        height={meta.h}
        sizes={sizes}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </picture>
  );
}

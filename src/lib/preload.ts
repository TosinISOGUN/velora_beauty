import { images, type ImageId } from "@/data/images.generated";

const requested = new Set<string>();

/**
 * Starts fetching a photograph before its page renders (a link preload that picks the same
 * candidate the page's <picture> will), so a page change never waits on the hero image.
 * Browser only; asking twice for the same image does nothing.
 */
export function preloadImage(id: ImageId, sizes: string) {
  if (typeof document === "undefined") return;
  const key = `${id}|${sizes}`;
  if (requested.has(key)) return;
  requested.add(key);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.type = "image/avif";
  link.setAttribute(
    "imagesrcset",
    images[id].sizes.map((w) => `/images/${id}-${w}.avif ${w}w`).join(", "),
  );
  link.setAttribute("imagesizes", sizes);
  document.head.appendChild(link);
}

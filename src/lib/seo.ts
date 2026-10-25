import { INDEXABLE, SITE_URL } from "@/data/site";

type SeoInput = {
  title: string;
  description: string;
  /** File name (no extension) under /og/. */
  image?: string;
};

/** Head tags shared by every page: title, description, robots, Open Graph and Twitter card. */
export function seo({ title, description, image = "home" }: SeoInput) {
  const og = `${SITE_URL}/og/${image}.jpg`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(INDEXABLE ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "VELORA BEAUTY" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: og },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: og },
      { name: "twitter:image:alt", content: title },
    ],
  };
}

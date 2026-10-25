import type { ImageId } from "./images.generated";

export type CategorySlug = "lips" | "cheeks" | "complexion";
export type Tone = "warm" | "cool" | "neutral";

/** One choice inside an option group (a shade, a scent). */
export interface Option {
  id: string;
  name: string;
  hex: string;
  /** Short skin-tone or undertone note shown beside the name. */
  note: string;
  tone: Tone;
}

/** A choice the shopper must make before adding to the bag, for example "Shade". */
export interface OptionGroup {
  id: string;
  label: string;
  options: Option[];
}

export interface ProductImage {
  image: ImageId;
  alt: string;
  kind: "texture" | "application";
}

export type MockupKind = "lip" | "blush" | "tint" | "serum" | "balm" | "set";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: CategorySlug | "set";
  categoryLabel: string;
  /** Sample price in US dollars. */
  price: number;
  size: string;
  short: string;
  full: string;
  /** Empty for products with nothing to choose. */
  groups: OptionGroup[];
  mockup: MockupKind;
  /** Packaging colour when no option is selected. */
  mockupHex: string;
  /** Set on products that appear in the three-step ritual. */
  ritual?: { step: 1 | 2 | 3; label: string };
  images: ProductImage[];
  details: string[];
  howTo: string[];
  ingredients: string;
}

/** Selected option id per group id. */
export type Selections = Record<string, string>;

export const CATEGORIES: { slug: CategorySlug; name: string; blurb: string; intro: string }[] = [
  {
    slug: "lips",
    name: "Lips",
    blurb: "Glossy, comfortable color for everyday mouths.",
    intro:
      "Treatments first, color second. Every lip product here is made to be worn on bare lips, layered over liner, or reapplied without a mirror.",
  },
  {
    slug: "cheeks",
    name: "Cheeks",
    blurb: "Cream blush that melts in, never sits on top.",
    intro:
      "The flush you get from a brisk walk, on demand. Cream formulas that blend with fingertips and stay soft all day.",
  },
  {
    slug: "complexion",
    name: "Complexion",
    blurb: "Skin-first tints, serums, and balms.",
    intro:
      "Light layers that let real skin show: a sheer tint in eight shades, a hydrating serum, and one balm for a dozen small jobs.",
  },
];

const lipShades: Option[] = [
  {
    id: "clear-glow",
    name: "Clear Glow",
    hex: "#F6DFCB",
    note: "No color, all gloss",
    tone: "neutral",
  },
  { id: "petal-mist", name: "Petal Mist", hex: "#E9A9A4", note: "Soft rose pink", tone: "cool" },
  {
    id: "cherry-silk",
    name: "Cherry Silk",
    hex: "#B83248",
    note: "Signature cherry red",
    tone: "neutral",
  },
  {
    id: "terracotta-bloom",
    name: "Terracotta Bloom",
    hex: "#C96F4A",
    note: "Warm clay orange",
    tone: "warm",
  },
  { id: "fig-noir", name: "Fig Noir", hex: "#6B3040", note: "Deep berry plum", tone: "cool" },
];

const blushShades: Option[] = [
  { id: "shell", name: "Shell", hex: "#F0D9C8", note: "Sheer porcelain nude", tone: "neutral" },
  { id: "peony", name: "Peony", hex: "#E8AFA6", note: "Cool baby pink", tone: "cool" },
  { id: "apricot", name: "Apricot", hex: "#E2916B", note: "Warm peachy coral", tone: "warm" },
  { id: "rosewood", name: "Rosewood", hex: "#B96A6E", note: "Muted dusty rose", tone: "neutral" },
  { id: "berry", name: "Berry", hex: "#9C4B63", note: "Deep juicy berry", tone: "cool" },
];

const tintShades: Option[] = [
  {
    id: "porcelain-1n",
    name: "Porcelain 1N",
    hex: "#F2DCCB",
    note: "Fairest, neutral",
    tone: "neutral",
  },
  { id: "linen-2n", name: "Linen 2N", hex: "#E9C7AC", note: "Light, neutral", tone: "neutral" },
  { id: "sand-3w", name: "Sand 3W", hex: "#DBA981", note: "Light-medium, warm", tone: "warm" },
  { id: "honey-4w", name: "Honey 4W", hex: "#C68F63", note: "Medium, warm golden", tone: "warm" },
  { id: "amber-5w", name: "Amber 5W", hex: "#B07847", note: "Medium-deep, warm", tone: "warm" },
  {
    id: "chestnut-6n",
    name: "Chestnut 6N",
    hex: "#8E5B37",
    note: "Deep, neutral",
    tone: "neutral",
  },
  { id: "cocoa-7n", name: "Cocoa 7N", hex: "#6E4227", note: "Very deep, neutral", tone: "neutral" },
  {
    id: "espresso-8n",
    name: "Espresso 8N",
    hex: "#4E2E1C",
    note: "Deepest, neutral",
    tone: "neutral",
  },
];

const balmScents: Option[] = [
  { id: "original", name: "Original", hex: "#F3E7D3", note: "Unscented, clear", tone: "neutral" },
  { id: "rose-petal", name: "Rose Petal", hex: "#EFBFB6", note: "Sheer rose tint", tone: "cool" },
  {
    id: "golden-hour",
    name: "Golden Hour",
    hex: "#E5C078",
    note: "Warm champagne glow",
    tone: "warm",
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "cloud-kiss-lip-treatment",
    name: "Cloud Kiss Lip Treatment",
    tagline: "Glossy, cushiony color",
    category: "lips",
    categoryLabel: "Lips",
    price: 26,
    size: "10 ml / 0.34 fl oz",
    short: "A glossy lip treatment with a cushiony balm core and a sheer wash of color.",
    full: "Cloud Kiss is a lip treatment first and a color second. The cushiony balm core melts onto the lips, while the sheer gel color sits softly on top: glossy, never sticky. Wear it alone on bare-lip days or layered over your favorite liner.",
    groups: [{ id: "shade", label: "Shade", options: lipShades }],
    mockup: "lip",
    mockupHex: "#B83248",
    ritual: { step: 3, label: "Finish" },
    images: [
      {
        image: "textureGloss",
        alt: "A gloss applicator touching a woman's lips, her fingertips painted red",
        kind: "texture",
      },
      {
        image: "textureLipSwatch",
        alt: "A group of lipsticks in rose, red, plum and magenta shades",
        kind: "texture",
      },
      {
        image: "galleryLipsApp",
        alt: "A woman with graphic yellow and green eyeliner and glossy red lips, resting her head on her hand",
        kind: "application",
      },
    ],
    details: [
      "Sheer-to-medium gel color with a glossy, cushiony finish.",
      "Balm core with a soft, melty texture that never feels sticky.",
      "Layerable: one swipe for a wash, three for a statement.",
      "10 ml squeezable tube with a soft precision tip.",
    ],
    howTo: [
      "Glide once across clean, bare lips for a sheer wash of color.",
      "Add a second or third swipe at the center for a fuller look.",
      "Reapply after eating or drinking as you would a balm.",
    ],
    ingredients:
      "Sample content. Hydrogenated Polyisobutene, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil, Tocopherol, Flavor/Aroma, May Contain: CI 15850, CI 45410, CI 77891.",
  },
  {
    slug: "soft-focus-cream-blush",
    name: "Soft Focus Cream Blush",
    tagline: "Melts in, never sits on top",
    category: "cheeks",
    categoryLabel: "Cheeks",
    price: 34,
    size: "6 g / 0.21 oz",
    short: "A cream blush that blurs into skin for a soft, lived-in flush.",
    full: "Soft Focus is a whipped cream blush that blurs into skin instead of sitting on top of it. The pigment stays true through the day and the finish stays soft, like the flush you get from a brisk walk.",
    groups: [{ id: "shade", label: "Shade", options: blushShades }],
    mockup: "blush",
    mockupHex: "#E8AFA6",
    ritual: { step: 2, label: "Add color" },
    images: [
      {
        image: "portraitFreckles2",
        alt: "A woman in profile with a makeup brush sweeping blush along her cheek",
        kind: "application",
      },
      {
        image: "tileCheeks",
        alt: "A makeup brush sweeping peach blush across a cheek",
        kind: "application",
      },
    ],
    details: [
      "Whipped cream texture that blurs into skin.",
      "Buildable from a whisper of color to a full flush.",
      "Stays soft and comfortable, with no caking or tightness.",
      "6 g compact with a matte velvet-touch case.",
    ],
    howTo: [
      "Tap a small amount onto the apples of your cheeks with fingertips.",
      "Blend upward and outward toward the temples.",
      "Layer for more intensity; it stays blendable for about a minute.",
    ],
    ingredients:
      "Sample content. Isododecane, Dimethicone, Cera Alba (Beeswax), Butyrospermum Parkii (Shea) Butter, Tocopherol, May Contain: CI 15850, CI 45410, CI 77491, CI 77891.",
  },
  {
    slug: "skin-veil-tint",
    name: "Skin Veil Tint",
    tagline: "Your skin, quietly even",
    category: "complexion",
    categoryLabel: "Complexion",
    price: 42,
    size: "30 ml / 1.0 fl oz",
    short: "A sheer complexion tint that evens tone while letting real skin show through.",
    full: "Skin Veil is a sheer, breathable tint that softens redness and evens tone without masking texture or freckles. It reads as your skin on a very good day, not as makeup sitting on top of it. Available in eight sample shades across neutral and warm undertones.",
    groups: [{ id: "shade", label: "Shade", options: tintShades }],
    mockup: "tint",
    mockupHex: "#C68F63",
    images: [
      {
        image: "gallerySkin",
        alt: "A woman in a white robe holding a glass dropper bottle of serum",
        kind: "application",
      },
      {
        image: "portraitDeep",
        alt: "A woman with her hair in an updo, a hoop earring and a flick of green liner, against a teal wall",
        kind: "application",
      },
    ],
    details: [
      "Sheer, buildable coverage that lets freckles and texture show.",
      "Soft satin finish, never flat and never shiny.",
      "Breathable feel; blends with fingers or a damp sponge.",
      "Eight sample shades from fair to deep, neutral and warm undertones.",
    ],
    howTo: [
      "Warm a pea-sized amount between fingertips.",
      "Press onto the center of the face and blend outward.",
      "Build a second thin layer only where you want more evenness.",
    ],
    ingredients:
      "Sample content. Aqua, Dimethicone, Glycerin, Niacinamide, Squalane, Tocopherol, Titanium Dioxide, Iron Oxides (CI 77491, CI 77492, CI 77499).",
  },
  {
    slug: "dew-drop-serum",
    name: "Dew Drop Serum",
    tagline: "A tall glass of water",
    category: "complexion",
    categoryLabel: "Complexion",
    price: 38,
    size: "30 ml / 1.0 fl oz",
    short: "A lightweight hydrating serum that preps skin before color.",
    full: "Dew Drop is a lightweight hydrating serum that sinks in quickly and leaves skin comfortable, a smooth base under tint or blush and a quiet pleasure on its own on bare-skin days.",
    groups: [],
    mockup: "serum",
    mockupHex: "#D9A441",
    ritual: { step: 1, label: "Prep" },
    images: [
      {
        image: "textureDropper",
        alt: "A hand squeezing a dropper of serum above an open palm against a peach background",
        kind: "texture",
      },
      {
        image: "routineReset",
        alt: "A woman in a towel wrap and white robe with under-eye patches, glancing at her phone",
        kind: "application",
      },
    ],
    details: [
      "Lightweight gel-serum with a quick-dry, no-tack finish.",
      "Layers cleanly under tint and blush.",
      "Made without added fragrance.",
      "30 ml glass bottle with a glass dropper.",
    ],
    howTo: [
      "Press 3 to 4 drops onto clean, slightly damp skin, morning and night.",
      "Wait about a minute before applying tint or color.",
      "Follow with balm as the last step of your routine.",
    ],
    ingredients:
      "Sample content. Aqua, Glycerin, Sodium Hyaluronate, Panthenol, Squalane, Allantoin, Sodium Benzoate.",
  },
  {
    slug: "everyday-glow-balm",
    name: "Everyday Glow Balm",
    tagline: "One balm, many jobs",
    category: "complexion",
    categoryLabel: "Complexion",
    price: 28,
    size: "15 ml / 0.5 fl oz",
    short: "A multipurpose balm for lips, cheekbones, brows, and everywhere else.",
    full: "Everyday Glow is the jar that lives in your jacket pocket. A featherweight balm that works as a lip mask, a cheekbone highlighter, a brow tamer, and a cuticle rescue: one product, a dozen small rituals.",
    groups: [{ id: "scent", label: "Scent", options: balmScents }],
    mockup: "balm",
    mockupHex: "#F3E7D3",
    images: [
      {
        image: "textureCream",
        alt: "A woman smoothing a small dab of cream onto her cheek",
        kind: "application",
      },
    ],
    details: [
      "Featherweight balm with a soft-focus sheen.",
      "Works on lips, cheekbones, brows, cuticles, and flyaways.",
      "Unscented Original; Rose Petal and Golden Hour add a sheer tint.",
      "15 ml screw-top jar in matte packaging.",
    ],
    howTo: [
      "Warm a small amount between fingertips.",
      "Press onto lips as a mask, or tap onto cheekbones for a sheen.",
      "Smooth a trace over brows to shape and soften.",
    ],
    ingredients:
      "Sample content. Cocos Nucifera (Coconut) Oil, Cera Alba (Beeswax), Butyrospermum Parkii (Shea) Butter, Simmondsia Chinensis (Jojoba) Seed Oil, Tocopherol, Parfum (Rose Petal and Golden Hour only).",
  },
  {
    slug: "the-daily-edit-set",
    name: "The Daily Edit Set",
    tagline: "Three steps, one zip pouch",
    category: "set",
    categoryLabel: "The Edit",
    price: 82,
    size: "3 full-size products",
    short: "Dew Drop Serum, Soft Focus Cream Blush, and Cloud Kiss together in a pouch.",
    full: "The Daily Edit bundles the three-step VELORA ritual, Dew Drop Serum, Soft Focus Cream Blush, and Cloud Kiss Lip Treatment, in a slim canvas pouch at a sample set price below buying them one by one.",
    groups: [
      { id: "blush", label: "Blush shade", options: blushShades },
      { id: "lip", label: "Lip shade", options: lipShades },
    ],
    mockup: "set",
    mockupHex: "#B83248",
    images: [
      {
        image: "routineMirror",
        alt: "A woman in a beige headscarf applying lipstick, seen in a hand mirror",
        kind: "application",
      },
    ],
    details: [
      "Includes full-size Dew Drop Serum, Soft Focus Cream Blush, and Cloud Kiss Lip Treatment.",
      "Sample set price of $82 versus $98 bought individually.",
      "Arrives in a slim natural-canvas pouch.",
      "You choose the blush shade and the lip shade below.",
    ],
    howTo: [
      "Prep with Dew Drop Serum.",
      "Add color with Soft Focus Cream Blush.",
      "Finish with Cloud Kiss Lip Treatment.",
    ],
    ingredients: "See the individual product pages for each ingredient list (sample content).",
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const productsByCategory = (category: CategorySlug): Product[] =>
  PRODUCTS.filter((p) => p.category === category);

export const formatPrice = (n: number): string => `$${n.toFixed(2).replace(/\.00$/, "")}`;

export const isShaded = (product: Product): boolean => product.groups.length > 0;

/** Ids of the groups that still need a choice before the product can go in the bag. */
export function missingGroups(product: Product, selections: Selections): OptionGroup[] {
  return product.groups.filter((g) => !g.options.some((o) => o.id === selections[g.id]));
}

export function selectedOption(product: Product, groupId: string, selections: Selections) {
  return product.groups
    .find((g) => g.id === groupId)
    ?.options.find((o) => o.id === selections[groupId]);
}

/** Stable key for a product plus its choices, used to merge identical bag lines. */
export function lineKey(product: Product, selections: Selections): string {
  const parts = product.groups.map((g) => `${g.id}=${selections[g.id] ?? ""}`);
  return [product.slug, ...parts].join("|");
}

/** "Shade: Peony" or "Blush shade: Peony, Lip shade: Cherry Silk". Empty when nothing is chosen. */
export function describeSelections(product: Product, selections: Selections): string {
  return product.groups
    .flatMap((g) => {
      const o = g.options.find((x) => x.id === selections[g.id]);
      return o ? [`${g.label}: ${o.name}`] : [];
    })
    .join(", ");
}

/** The colour the packaging illustration should show for the current choices. */
export function packagingHex(product: Product, selections: Selections): string {
  if (product.slug === "the-daily-edit-set") {
    return selectedOption(product, "lip", selections)?.hex ?? product.mockupHex;
  }
  const first = product.groups[0];
  return (first && selectedOption(product, first.id, selections)?.hex) || product.mockupHex;
}

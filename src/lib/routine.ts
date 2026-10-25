import {
  getProductBySlug,
  missingGroups,
  type Option,
  type OptionGroup,
  type Product,
  type Selections,
} from "@/data/products";

export type Goal = "everyday" | "soft" | "color" | "skincare";
export type Finish = "sheer" | "bold" | "any";
export type Undertone = "warm" | "cool" | "neutral" | "any";

export interface RoutineAnswers {
  goal: Goal;
  /** Optional: skipping is the same as "any". */
  finish?: Finish;
  undertone?: Undertone;
}

export interface RoutinePick {
  product: Product;
  /** Choices made for the shopper. Empty for the tint, whose shade the shopper must choose. */
  selections: Selections;
  /** Groups the shopper still has to choose, for example the tint shade. */
  needsChoice: OptionGroup[];
  reason: string;
}

export const GOALS: { id: Goal; label: string; blurb: string }[] = [
  { id: "everyday", label: "A quick everyday look", blurb: "Three products, two minutes." },
  { id: "soft", label: "A soft, natural finish", blurb: "Skin first, with a quiet flush." },
  { id: "color", label: "A little more color", blurb: "Blush and lips with some presence." },
  {
    id: "skincare",
    label: "A simple skincare-inspired routine",
    blurb: "Hydration and a balm for the day.",
  },
];

const SLUGS: Record<Goal, string[]> = {
  everyday: ["skin-veil-tint", "everyday-glow-balm", "cloud-kiss-lip-treatment"],
  soft: ["dew-drop-serum", "skin-veil-tint", "soft-focus-cream-blush"],
  color: ["soft-focus-cream-blush", "cloud-kiss-lip-treatment", "everyday-glow-balm"],
  skincare: ["dew-drop-serum", "everyday-glow-balm", "skin-veil-tint"],
};

const REASONS: Record<string, string> = {
  "skin-veil-tint": "Evens tone while real skin shows through. Pick your shade on its page.",
  "everyday-glow-balm": "One balm for lips, cheekbones, and brows.",
  "cloud-kiss-lip-treatment": "A glossy treatment with a sheer wash of color.",
  "dew-drop-serum": "A lightweight base that preps skin before color.",
  "soft-focus-cream-blush": "A cream flush that blends with your fingertips.",
};

/** Shades that read as the stronger choice in their group; the rest count as sheer. */
const BOLD = new Set([
  "cherry-silk",
  "terracotta-bloom",
  "fig-noir",
  "apricot",
  "rosewood",
  "berry",
  "golden-hour",
]);

const DEFAULT_FINISH: Record<Goal, Finish> = {
  everyday: "any",
  soft: "sheer",
  color: "bold",
  skincare: "sheer",
};

function pickOption(group: OptionGroup, finish: Finish, undertone: Undertone): Option {
  const byTone =
    undertone === "any" ? group.options : group.options.filter((o) => o.tone === undertone);
  const tonePool = byTone.length > 0 ? byTone : group.options;
  const byFinish =
    finish === "any" ? tonePool : tonePool.filter((o) => (finish === "bold") === BOLD.has(o.id));
  return (byFinish[0] ?? tonePool[0])!;
}

/**
 * Maps the shopper's answers to real products in the demo catalog. Tint shades are never guessed:
 * the tint comes back with its shade group in `needsChoice`.
 */
export function buildRoutine(answers: RoutineAnswers): RoutinePick[] {
  const finish =
    answers.finish && answers.finish !== "any" ? answers.finish : DEFAULT_FINISH[answers.goal];
  const undertone = answers.undertone ?? "any";
  return SLUGS[answers.goal].flatMap((slug): RoutinePick[] => {
    const product = getProductBySlug(slug);
    if (!product) return [];
    const selections: Selections = {};
    if (slug !== "skin-veil-tint") {
      for (const group of product.groups) {
        selections[group.id] = pickOption(group, finish, undertone).id;
      }
    }
    return [
      {
        product,
        selections,
        needsChoice: missingGroups(product, selections),
        reason: REASONS[slug] ?? product.short,
      },
    ];
  });
}

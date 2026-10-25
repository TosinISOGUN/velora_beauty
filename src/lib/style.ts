import type { CSSProperties } from "react";

/** Stagger index for the `.rise` entrance animation. */
export const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/** Sets one CSS custom property inline. */
export const cssVar = (name: `--${string}`, value: string | number) =>
  ({ [name]: value }) as CSSProperties;

/** Category ground colours for product tiles and the packaging slide of the gallery. */
export const TILE = {
  lips: "var(--s-lips)",
  cheeks: "var(--s-cheeks)",
  complexion: "var(--s-complexion)",
  set: "var(--s-set)",
} as const;

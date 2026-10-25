import { useId } from "react";

import type { MockupKind } from "@/data/products";

/**
 * Conceptual VELORA packaging, drawn as vector shapes with cylinder shading.
 *
 * VELORA is fictional, so its products are consistent design assets rather than photographs of
 * real products. The same illustration is used on the home page, shop, product pages, bag and
 * routine, and it takes the colour of the shade that is selected.
 */

interface Props {
  kind: MockupKind;
  hex: string;
  /** Second colour, used by the set to show the blush alongside the lip. */
  hex2?: string;
  className?: string;
  /** Decorative by default; pass a label when the illustration is the only description. */
  label?: string;
}

const PLUM = "#141a2e";
const PORCELAIN = "#F7F8FB";

export function ProductMockup({ kind, hex, hex2, className, label }: Props) {
  const id = useId();
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return (
    <svg viewBox="0 0 200 240" className={className} {...a11y}>
      <defs>
        {/* Cylinder shading: dark rim on the left, a soft highlight, a darker right edge. */}
        <linearGradient id={`${id}-cyl`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.32" />
          <stop offset="0.16" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.46" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8d7a5b" />
          <stop offset="0.28" stopColor="#f4e6c4" />
          <stop offset="0.5" stopColor="#c8b184" />
          <stop offset="0.78" stopColor="#7a6a4d" />
          <stop offset="1" stopColor="#b9a47a" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id={`${id}-pan`} cx="0.34" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
        <radialGradient id={`${id}-rim`} cx="0.3" cy="0.25" r="1">
          <stop offset="0" stopColor="#fbf6ef" />
          <stop offset="0.55" stopColor="#cfc4bb" />
          <stop offset="1" stopColor="#8f847d" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse
        cx="100"
        cy="219"
        rx="58"
        ry="8"
        fill="#000"
        opacity="0.5"
        filter={`url(#${id}-soft)`}
      />
      {kind === "lip" && <Lip hex={hex} id={id} />}
      {kind === "blush" && <Blush hex={hex} id={id} />}
      {kind === "tint" && <Tint hex={hex} id={id} />}
      {kind === "serum" && <Serum hex={hex} id={id} />}
      {kind === "balm" && <Balm hex={hex} id={id} />}
      {kind === "set" && <SetKit hex={hex} hex2={hex2 ?? "#E8AFA6"} id={id} />}
    </svg>
  );
}

type LabelProps = { x: number; y: number; fill?: string; size?: number; spacing?: number };

function Label({ x, y, fill = PORCELAIN, size = 7, spacing = 1.8 }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fontFamily="Gambetta, Georgia, serif"
      fontSize={size}
      fontWeight="500"
      letterSpacing={spacing}
      fill={fill}
      textAnchor="middle"
    >
      VELORA
    </text>
  );
}

type P = { hex: string; id: string };

/** A body shape with the cylinder shading laid over its flat colour. */
function Shaded({
  id,
  fill,
  ...rect
}: { id: string; fill: string } & Omit<React.SVGProps<SVGRectElement>, "fill">) {
  return (
    <>
      <rect {...rect} fill={fill} />
      <rect {...rect} fill={`url(#${id}-cyl)`} />
    </>
  );
}

function Lip({ hex, id }: P) {
  return (
    <g>
      <Shaded id={id} x={78} y={22} width={44} height={56} rx={10} fill={hex} />
      <rect x="84" y="26" width="3" height="40" rx="1.5" fill="#fff" opacity="0.28" />
      <rect x="77" y="76" width="46" height="9" rx="2" fill={`url(#${id}-metal)`} />
      <Shaded id={id} x={78} y={85} width={44} height={130} rx={8} fill={PORCELAIN} />
      <g transform="rotate(-90 100 150)">
        <Label x={100} y={153} fill={PLUM} size={8} spacing={2.6} />
      </g>
    </g>
  );
}

function Blush({ hex, id }: P) {
  return (
    <g>
      <circle cx="100" cy="118" r="80" fill={`url(#${id}-rim)`} />
      <circle cx="100" cy="118" r="72" fill="#EFEBE7" />
      <circle cx="100" cy="118" r="72" fill={`url(#${id}-pan)`} opacity="0.5" />
      <circle cx="100" cy="118" r="58" fill={hex} />
      <circle cx="100" cy="118" r="58" fill={`url(#${id}-pan)`} />
      <ellipse
        cx="88"
        cy="100"
        rx="22"
        ry="9"
        fill="#fff"
        opacity="0.16"
        transform="rotate(-24 88 100)"
      />
      <ellipse cx="116" cy="138" rx="18" ry="9" fill="#000" opacity="0.08" />
      <Label x={100} y={194} fill={PLUM} size={6.5} spacing={2.4} />
    </g>
  );
}

function Tint({ hex, id }: P) {
  return (
    <g>
      <Shaded id={id} x={88} y={14} width={24} height={12} rx={3} fill="#cfc4bb" />
      <Shaded id={id} x={94} y={24} width={12} height={12} fill="#cfc4bb" />
      <rect x="86" y="34" width="28" height="16" rx="3" fill={`url(#${id}-metal)`} />
      <Shaded id={id} x={80} y={50} width={40} height={164} rx={10} fill={PORCELAIN} />
      <path d="M81 152 h38 v52 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 z" fill={hex} />
      <path
        d="M81 152 h38 v52 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 z"
        fill={`url(#${id}-cyl)`}
      />
      <rect x="80" y="150" width="40" height="3" fill="#000" opacity="0.18" />
      <Label x={100} y={110} fill={PLUM} size={5.8} spacing={1.4} />
    </g>
  );
}

function Serum({ hex, id }: P) {
  return (
    <g>
      <rect x="99" y="14" width="2.4" height="14" rx="1" fill="#2a1822" />
      <Shaded id={id} x={90} y={24} width={20} height={42} rx={6} fill="#2a1822" />
      <rect x="86" y="62" width="28" height="8" rx="2" fill={`url(#${id}-metal)`} />
      <Shaded id={id} x={72} y={70} width={56} height={146} rx={14} fill={hex} />
      <rect x="72" y="70" width="56" height="146" rx="14" fill={`url(#${id}-glass)`} />
      <rect x="97" y="70" width="5" height="116" rx="2.5" fill="#fff" opacity="0.4" />
      <Label x={100} y={152} fill={PLUM} size={7.5} spacing={1.7} />
    </g>
  );
}

function Balm({ hex, id }: P) {
  return (
    <g>
      <Shaded id={id} x={54} y={74} width={92} height={34} rx={12} fill={PORCELAIN} />
      <rect x="54" y="100" width="92" height="8" fill={`url(#${id}-metal)`} />
      <Shaded id={id} x={60} y={110} width={80} height={102} rx={15} fill={hex} />
      <rect x="60" y="110" width="80" height="102" rx="15" fill={`url(#${id}-glass)`} />
      <Label x={100} y={166} fill={PLUM} size={9} spacing={2.4} />
    </g>
  );
}

function SetKit({ hex, hex2, id }: P & { hex2: string }) {
  const serumHex = "#D9A441";
  return (
    <g>
      <Shaded id={id} x={34} y={68} width={28} height={42} rx={8} fill={hex} />
      <rect x="33" y="108" width="30" height="6" rx="1.5" fill={`url(#${id}-metal)`} />
      <Shaded id={id} x={34} y={114} width={28} height={88} rx={6} fill={PORCELAIN} />
      <circle cx="122" cy="122" r="52" fill={`url(#${id}-rim)`} />
      <circle cx="122" cy="122" r="45" fill="#EFEBE7" />
      <circle cx="122" cy="122" r="36" fill={hex2} />
      <circle cx="122" cy="122" r="36" fill={`url(#${id}-pan)`} />
      <Shaded id={id} x={152} y={94} width={18} height={28} rx={5} fill="#2a1822" />
      <Shaded id={id} x={146} y={124} width={30} height={80} rx={10} fill={serumHex} />
      <rect x="146" y="124" width="30" height="80" rx="10" fill={`url(#${id}-glass)`} />
      <rect x="28" y="204" width="156" height="7" rx="3.5" fill={hex} opacity="0.55" />
    </g>
  );
}

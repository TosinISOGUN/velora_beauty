import { Link } from "@tanstack/react-router";

import { CONCEPT_NOTE, footerHelp, footerLegal, footerShop, site } from "@/data/site";

import { Wordmark } from "./brand";
import { NavLink } from "./nav-link";

const item =
  "inline-flex min-h-11 items-center text-on-panel/80 transition-colors hover:text-white";
const heading = "mb-2 text-xs font-bold uppercase tracking-[0.16em] text-petal";

export function SiteFooter() {
  return (
    <footer className="bg-panel text-on-panel">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Link
            to="/"
            aria-label={`${site.name}, home`}
            className="inline-flex min-h-12 items-center text-on-panel"
          >
            <Wordmark className="!text-on-panel" />
          </Link>
          <p className="mt-6 max-w-[34ch] font-display text-[1.6rem] leading-snug text-on-panel">
            {site.tagline}
          </p>
          <p className="mt-3 max-w-[40ch] text-sm text-on-panel/75">{site.support}</p>
        </div>

        <nav aria-label="Shop" className="flex flex-col">
          <h2 className={heading}>Shop</h2>
          {footerShop.map((n) => (
            <NavLink key={n.label} target={n} className={item}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <nav aria-label="Help" className="flex flex-col">
          <h2 className={heading}>Help</h2>
          {footerHelp.map((n) => (
            <NavLink key={n.label} target={n} className={item}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <nav aria-label="Legal" className="flex flex-col">
          <h2 className={heading}>Legal</h2>
          {footerLegal.map((n) => (
            <NavLink key={n.label} target={n} className={item}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap py-6 text-xs leading-relaxed text-on-panel/70">
          <p className="max-w-3xl">
            © {new Date().getFullYear()} {site.name}. {CONCEPT_NOTE} Shipping, returns and policy
            text on this site is sample copy.
          </p>
        </div>
      </div>
    </footer>
  );
}

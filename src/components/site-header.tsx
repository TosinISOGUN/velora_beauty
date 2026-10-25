import { Handbag, List, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { nav, site } from "@/data/site";
import { useBag } from "@/lib/bag";

import { Wordmark } from "./brand";
import { NavLink } from "./nav-link";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { Sheet } from "./sheet";

/**
 * Sticky header. It sits on the page background at the top and gains a solid surface and hairline
 * once the page scrolls, detected with an IntersectionObserver sentinel (no scroll listeners).
 */
export function SiteHeader() {
  const { count, openBag } = useBag();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="absolute top-0 h-px w-px" />
      <header
        data-site-header
        data-top={scrolled ? undefined : ""}
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          scrolled ? "glass-surface !border-x-0 !border-t-0" : "bg-transparent"
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <div className="wrap grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <button
            type="button"
            className="icon-btn row-start-1 -ml-2 justify-self-start lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <List size={26} aria-hidden />
          </button>

          <Link
            to="/"
            aria-label={`${site.name}, home`}
            className="col-start-2 row-start-1 justify-self-center lg:col-start-1 lg:justify-self-start"
          >
            <Wordmark />
          </Link>

          <nav
            aria-label="Main"
            className="col-start-2 row-start-1 hidden items-center gap-1 lg:flex"
          >
            {nav.map((item) => (
              <NavLink
                key={item.label}
                target={item}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.92rem] font-semibold text-fg transition-colors hover:bg-fg/[0.07] [&[aria-current=page]]:bg-fg [&[aria-current=page]]:text-bg"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="col-start-3 row-start-1 flex items-center justify-self-end">
            <ThemeToggle />
            <button
              type="button"
              className="icon-btn"
              aria-label="Search products"
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
            >
              <MagnifyingGlass size={24} aria-hidden />
            </button>
            <button
              type="button"
              className="icon-btn -mr-2"
              aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
              aria-haspopup="dialog"
              onClick={openBag}
            >
              <Handbag size={24} aria-hidden />
              {count > 0 && (
                <span
                  aria-hidden
                  className="pop absolute right-0.5 top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-bold leading-none text-on-accent"
                  key={count}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        side="left"
        label="Menu"
        title="Menu"
      >
        <nav aria-label="Menu" className="flex flex-1 flex-col overflow-y-auto p-5">
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <li key={item.label}>
                <NavLink
                  target={item}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-16 items-center justify-between font-display text-[1.9rem] text-fg"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/routine"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-16 items-center font-display text-[1.9rem] text-fg"
              >
                Build a routine
              </Link>
            </li>
          </ul>
          <ul className="mt-auto space-y-1 pt-8 text-sm font-semibold text-muted">
            <li>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center"
              >
                Contact and FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center"
              >
                Shopping bag{count > 0 ? ` (${count})` : ""}
              </Link>
            </li>
          </ul>
        </nav>
      </Sheet>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

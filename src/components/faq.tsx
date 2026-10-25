import { Plus } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type Item = { q: string; a: ReactNode };

/** Accordion on native <details>: keyboard and screen reader behavior come built in. */
export function Faq({ items, className = "" }: { items: Item[]; className?: string }) {
  return (
    <div className={`faq border-t border-line ${className}`}>
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <Plus size={22} className="faq-icon text-accent-text" aria-hidden />
          </summary>
          <div className="faq-body">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

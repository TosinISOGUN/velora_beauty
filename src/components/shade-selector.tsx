import { Check } from "@phosphor-icons/react";

import type { OptionGroup } from "@/data/products";

type Props = {
  group: OptionGroup;
  value: string | undefined;
  onChange: (optionId: string) => void;
  error?: string | undefined;
  /** Distinguishes two groups on one page (the set has a blush and a lip group). */
  name: string;
};

/**
 * Shade or scent chooser. Each option is a real radio button inside a large labelled tile, with
 * the colour, the name and an undertone note, so the choice never relies on colour alone.
 */
export function ShadeSelector({ group, value, onChange, error, name }: Props) {
  const selected = group.options.find((o) => o.id === value);
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="flex w-full flex-wrap items-baseline gap-x-2 text-sm font-bold uppercase tracking-[0.08em] text-fg">
        {group.label}
        <span className="text-sm font-semibold normal-case tracking-normal text-muted">
          {selected ? `${selected.name}, ${selected.note.toLowerCase()}` : "Choose one"}
        </span>
      </legend>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        {group.options.map((o) => (
          <label key={o.id} className="shade">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
            />
            <span className="shade-swatch" style={{ background: o.hex }} aria-hidden>
              <Check size={16} weight="bold" className="shade-check" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.95rem] font-bold text-fg">{o.name}</span>
              <span className="block truncate text-xs text-muted">{o.note}</span>
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

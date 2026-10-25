import { ArrowLeft, ArrowRight, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { describeSelections, formatPrice, packagingHex } from "@/data/products";
import { useBag } from "@/lib/bag";
import {
  GOALS,
  buildRoutine,
  type Finish,
  type Goal,
  type RoutineAnswers,
  type Undertone,
} from "@/lib/routine";

import { ProductMockup } from "./product-mockup";

const FINISHES: { id: Finish; label: string; blurb: string }[] = [
  { id: "sheer", label: "Sheer and soft", blurb: "Just a wash of color." },
  { id: "bold", label: "Bolder", blurb: "Color you can see from across the room." },
];

const UNDERTONES: { id: Undertone; label: string; blurb: string }[] = [
  { id: "warm", label: "Warm", blurb: "Golden, peachy, olive." },
  { id: "cool", label: "Cool", blurb: "Pink, rosy, bluish." },
  { id: "neutral", label: "Neutral", blurb: "A mix of both." },
];

const QUESTIONS = [
  { title: "What do you want to explore?", optional: false },
  { title: "How much color do you like?", optional: true },
  { title: "Which tones suit you?", optional: true },
] as const;

const SURFACE = {
  lips: "bg-s-lips",
  cheeks: "bg-s-cheeks",
  complexion: "bg-s-complexion",
  set: "bg-s-set",
} as const;

function Choice({ label, blurb, onClick }: { label: string; blurb: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-20 w-full items-center justify-between gap-4 rounded-[var(--radius-card)] border-2 border-line bg-surface p-5 text-left transition-colors hover:border-fg"
    >
      <span>
        <span className="block font-display text-[1.45rem] leading-tight text-fg">{label}</span>
        <span className="mt-1 block text-sm text-muted">{blurb}</span>
      </span>
      <ArrowRight
        size={22}
        aria-hidden
        className="shrink-0 text-accent-text transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}

/**
 * A short, honest product finder. Up to three questions, two of them optional, mapped to real
 * products. No account, photo or personal data, and no claims about skin.
 */
export function RoutineBuilder() {
  const { addMany } = useBag();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<RoutineAnswers>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const done = step >= QUESTIONS.length;
  const picks = done && answers.goal ? buildRoutine({ ...answers, goal: answers.goal }) : [];
  const addable = picks.filter((p) => p.needsChoice.length === 0);
  const total = addable.reduce((n, p) => n + p.product.price, 0);

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }
  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
          {done ? "Your picks" : `Question ${step + 1} of ${QUESTIONS.length}`}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-10 rounded-full ${i <= step ? "bg-accent" : "bg-fg/15"}`}
            />
          ))}
        </div>
      </div>

      {!done ? (
        <div className="mt-6">
          <h2 ref={heading} tabIndex={-1} className="display-lg outline-none">
            {QUESTIONS[step]?.title}
          </h2>
          {QUESTIONS[step]?.optional && (
            <p className="mt-2 text-muted">Optional. Skip it and you will still get picks.</p>
          )}
          <div className="mt-8 grid gap-3">
            {step === 0 &&
              GOALS.map((g) => (
                <Choice
                  key={g.id}
                  label={g.label}
                  blurb={g.blurb}
                  onClick={() => {
                    setAnswers({ goal: g.id as Goal });
                    setStep(1);
                  }}
                />
              ))}
            {step === 1 &&
              FINISHES.map((f) => (
                <Choice
                  key={f.id}
                  label={f.label}
                  blurb={f.blurb}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, finish: f.id }));
                    setStep(2);
                  }}
                />
              ))}
            {step === 2 &&
              UNDERTONES.map((u) => (
                <Choice
                  key={u.id}
                  label={u.label}
                  blurb={u.blurb}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, undertone: u.id }));
                    setStep(3);
                  }}
                />
              ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6">
            {step > 0 && (
              <button type="button" className="btn-text" onClick={back}>
                <ArrowLeft size={18} aria-hidden /> Back
              </button>
            )}
            {QUESTIONS[step]?.optional && (
              <button type="button" className="btn-text !text-fg" onClick={() => setStep(step + 1)}>
                Skip this question
              </button>
            )}
            {step > 0 && (
              <button type="button" className="btn-text !text-fg" onClick={reset}>
                <ArrowCounterClockwise size={18} aria-hidden /> Start again
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 ref={heading} tabIndex={-1} className="display-lg outline-none">
            {GOALS.find((g) => g.id === answers.goal)?.label}
          </h2>
          <p className="lead mt-3">
            Chosen from the six demo products. Change any shade on its product page.
          </p>
          <ul className="mt-8 grid gap-4">
            {picks.map((p) => {
              const detail = describeSelections(p.product, p.selections);
              return (
                <li
                  key={p.product.slug}
                  className="grid grid-cols-[6rem_1fr] gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-6 sm:p-5"
                >
                  <div
                    className={`grid aspect-square place-items-center rounded-2xl ${SURFACE[p.product.category]}`}
                  >
                    <ProductMockup
                      kind={p.product.mockup}
                      hex={packagingHex(p.product, p.selections)}
                      className="h-[5rem] w-auto"
                    />
                  </div>
                  <div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.product.slug }}
                      className="font-display text-[1.4rem] leading-tight text-fg hover:underline"
                    >
                      {p.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{p.reason}</p>
                    <p className="mt-1 text-sm font-semibold text-fg">
                      {detail || "Shade chosen by you"} · {formatPrice(p.product.price)}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    {p.needsChoice.length > 0 ? (
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.product.slug }}
                        className="btn btn-ghost w-full sm:w-auto"
                      >
                        Choose {p.needsChoice[0]?.label.toLowerCase()}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost w-full sm:w-auto"
                        onClick={() => addMany([{ product: p.product, selections: p.selections }])}
                      >
                        Add to Bag
                        <span className="sr-only">: {p.product.name}</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] bg-bg-2 p-5 sm:p-6">
            <button
              type="button"
              className="btn btn-primary"
              disabled={addable.length === 0}
              onClick={() =>
                addMany(addable.map((p) => ({ product: p.product, selections: p.selections })))
              }
            >
              Add {addable.length} to your bag, {formatPrice(total)}
            </button>
            {picks.some((p) => p.needsChoice.length > 0) && (
              <p className="max-w-[40ch] text-sm text-muted">
                Skin Veil Tint needs a shade you pick yourself, so it is not included in this total.
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6">
            <button type="button" className="btn-text" onClick={back}>
              <ArrowLeft size={18} aria-hidden /> Back
            </button>
            <button type="button" className="btn-text !text-fg" onClick={reset}>
              <ArrowCounterClockwise size={18} aria-hidden /> Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

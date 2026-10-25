import { Check } from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type State = { status: "idle" } | { status: "error"; message: string } | { status: "done" };

/**
 * Email sign-up. It validates the address and shows a demo confirmation. Nothing is sent, saved
 * or logged: the address never leaves this component.
 */
export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const input = useRef<HTMLInputElement>(null);
  const dark = tone === "dark";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = input.current?.value.trim() ?? "";
    if (!value) {
      setState({ status: "error", message: "Enter your email address to sign up." });
      input.current?.focus();
      return;
    }
    if (!EMAIL.test(value)) {
      setState({
        status: "error",
        message: "That email address doesn't look right. Check for typos.",
      });
      input.current?.focus();
      return;
    }
    setState({ status: "done" });
  }

  if (state.status === "done") {
    return (
      <div role="status" className="pop flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <Check size={22} weight="bold" aria-hidden />
        </span>
        <div>
          <p className={`font-display text-[1.5rem] ${dark ? "text-on-panel" : "text-fg"}`}>
            Thanks. This is a demo.
          </p>
          <p className={dark ? "text-on-panel/80" : "text-muted"}>
            Nothing was sent or saved, because VELORA is a fictional brand.
          </p>
          <button
            type="button"
            onClick={() => setState({ status: "idle" })}
            className={`mt-2 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4 ${dark ? "text-on-panel" : "text-accent-text"}`}
          >
            Try another address
          </button>
        </div>
      </div>
    );
  }

  const error = state.status === "error" ? state.message : undefined;
  return (
    <form noValidate onSubmit={onSubmit} aria-label="Email sign-up">
      <label
        htmlFor="newsletter-email"
        className={`block text-sm font-bold ${dark ? "text-on-panel" : "text-fg"}`}
      >
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          ref={input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="field sm:flex-1"
        />
        <button type="submit" className={`btn ${dark ? "btn-primary" : "btn-solid"}`}>
          Sign up
        </button>
      </div>
      {error && (
        <p
          id="newsletter-error"
          role="alert"
          className={`mt-2 pl-2 text-sm font-bold ${dark ? "text-[#ffb3be]" : "text-[#a31d2e]"}`}
        >
          {error}
        </p>
      )}
      <p className={`mt-3 text-xs ${dark ? "text-on-panel/70" : "text-muted"}`}>
        Demo form: it checks the address and sends nothing.
      </p>
    </form>
  );
}

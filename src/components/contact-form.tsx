import { Check } from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = [
  "Choosing a product",
  "Choosing a shade",
  "Shipping and returns (sample)",
  "Something else",
] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Demonstration contact form: labels above fields, specific errors below them, focus moved to the
 * first problem. Nothing is sent or stored.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Enter your name.";
    if (!email) next.email = "Enter your email address.";
    else if (!EMAIL.test(email))
      next.email = "That email address doesn't look right. Check for typos.";
    if (message.length < 10)
      next.message = "Write a few words so we know what you need (10 characters or more).";
    setErrors(next);
    const firstKey = (["name", "email", "message"] as const).find((k) => next[k]);
    if (firstKey) {
      refs[firstKey].current?.focus();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="pop card p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-on-accent">
          <Check size={24} weight="bold" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-[1.8rem]">Thanks. This is a demo.</h2>
        <p className="mt-2 max-w-[46ch] text-muted">
          Your message was not sent and was not saved. VELORA is a fictional brand, so no one will
          read it.
        </p>
        <button type="button" className="btn btn-ghost mt-5" onClick={() => setDone(false)}>
          Write another
        </button>
      </div>
    );
  }

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });
  const err = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`contact-${key}-error`} role="alert" className="field-error">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-label="Contact form (demo)">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-bold text-fg">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          ref={refs.name}
          autoComplete="name"
          className="field"
          {...field("name")}
        />
        {err("name")}
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-bold text-fg">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          ref={refs.email}
          autoComplete="email"
          inputMode="email"
          className="field"
          {...field("email")}
        />
        {err("email")}
      </div>
      <div>
        <label htmlFor="contact-topic" className="mb-2 block text-sm font-bold text-fg">
          What can we help with?
        </label>
        <select id="contact-topic" name="topic" className="field" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-bold text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          ref={refs.message}
          className="field"
          {...field("message")}
        />
        {err("message")}
      </div>
      <button type="submit" className="btn btn-primary">
        Send message
      </button>
      <p className="text-sm text-muted">Demo form: it checks your entries and sends nothing.</p>
    </form>
  );
}

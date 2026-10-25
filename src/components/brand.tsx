/**
 * Typographic wordmark: an oversized Gambetta V leading small spaced capitals, set on a hairline,
 * with BEAUTY underneath. Pure type, no emblem.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end text-fg ${className}`}>
      <span className="font-display text-[2.7rem] font-medium leading-[0.74]">V</span>
      <span className="-ml-0.5 flex flex-col pb-[0.1rem]">
        <span className="caps-serif border-b border-current pb-[0.2rem] text-[1.02rem] leading-none tracking-[0.34em]">
          ELORA
        </span>
        <span className="mt-1 text-[0.5rem] font-bold uppercase leading-none tracking-[0.62em]">
          Beauty
        </span>
      </span>
    </span>
  );
}

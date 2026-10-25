export function formatPrice(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function useFormatters() {
  return { formatPrice, validateEmail };
}

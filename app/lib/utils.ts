export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price);
}

export function discountPercentage(price: number, comparePrice: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function slugify(text: string): string {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function truncate(text: string, length: number): string {
  return text.length <= length ? text : text.slice(0, length).trimEnd() + "...";
}

export function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

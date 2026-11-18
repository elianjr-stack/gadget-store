export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) return '৳0';
  const num = Number(price);
  return `৳${num.toLocaleString('en-IN')}`;
}

export function formatPriceBn(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) return '৳০';
  const enStr = Number(price).toLocaleString('en-IN');
  const bnDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  const bnStr = enStr.replace(/[0-9]/g, (d) => bnDigits[d] || d);
  return `৳${bnStr}`;
}

export function calculateDiscount(price: number, comparePrice: number | null | undefined): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function truncate(text: string, length = 100): string {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const ratingFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 1,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatRating(value: number): string {
  return ratingFormatter.format(value);
}

export function pluralizeRu(
  value: number,
  forms: [string, string, string],
): string {
  const absolute = Math.abs(value) % 100;
  const lastDigit = absolute % 10;

  if (absolute > 10 && absolute < 20) {
    return forms[2];
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  return forms[2];
}

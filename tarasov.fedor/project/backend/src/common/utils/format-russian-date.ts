const russianDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatRussianDate(value: Date): string {
  return russianDateFormatter.format(value);
}

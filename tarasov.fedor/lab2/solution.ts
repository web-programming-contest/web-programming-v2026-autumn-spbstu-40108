function getPluralForm(
  number: number,
  one: string,
  two: string,
  five: string,
): string {
  let n = Math.abs(number);
  n %= 100;

  if (n >= 5 && n <= 20) {
    return five;
  }

  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }

  return five;
}

export function timeAgo(pastDate: Date): string {
  if (isNaN(pastDate.getTime())) {
    throw new Error('Передана некорректная дата');
  }

  const now = new Date();

  if (pastDate.getTime() > now.getTime()) {
    throw new Error('Дата не может быть в будущем');
  }

  const diffMs = now.getTime() - pastDate.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} ${getPluralForm(diffMinutes, 'минуту', 'минуты', 'минут')} назад`;
  }

  if (diffHours < 24) {
    return `${diffHours} ${getPluralForm(diffHours, 'час', 'часа', 'часов')} назад`;
  }

  return `${diffDays} ${getPluralForm(diffDays, 'день', 'дня', 'дней')} назад`;
}

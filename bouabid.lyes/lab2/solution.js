/**
 * Генерация случайного HEX-цвета (Вариант 23: generate-hex-color).
 *
 * @returns {string} Строка в формате #RRGGBB
 */
export function generateHexColor() {
  const hexChars = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * hexChars.length);
    color += hexChars[randomIndex];
  }

  return color;
}

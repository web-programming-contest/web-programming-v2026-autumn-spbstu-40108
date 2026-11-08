export function shuffleArray(arr) {
  const result = [...arr]; // копия массива
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    [result[i], result[j]] = [result[j], result[i]]; // меняем элементы местами
  }
  return result;
}

export function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  if (!arrays.every(Array.isArray)) {
    throw new TypeError('Все аргументы должны быть массивами');
  }

  const length = arrays[0].length;

  if (!arrays.every((array) => array.length === length)) {
    throw new Error('Массивы должны иметь одинаковую длину');
  }

  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(arrays.map((array) => array[i]));
  }

  return result;
}

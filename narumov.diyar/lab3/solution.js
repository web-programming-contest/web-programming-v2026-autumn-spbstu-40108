export function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  for (const array of arrays) {
    if (!Array.isArray(array)) {
      throw new TypeError('Ожидается массив, но передан другой тип данных');
    }

    if (array.length !== arrays[0].length) {
      throw new Error('Массивы должны иметь одинаковую длину');
    }
  }

  const length = arrays[0].length;
  const result = [];

  for (let index = 0; index < length; index += 1) {
    const group = [];

    for (const array of arrays) {
      group.push(array[index]);
    }

    result.push(group);
  }

  return result;
}

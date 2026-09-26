export function moveZerosToEnd(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('Ожидается массив, но передан другой тип данных');
  }

  const nonZeros: unknown[] = [];
  const zeros: unknown[] = [];

  for (const item of arr) {
    if (item === 0) {
      zeros.push(item);
    } else {
      nonZeros.push(item);
    }
  }

  return [...nonZeros, ...zeros];
}

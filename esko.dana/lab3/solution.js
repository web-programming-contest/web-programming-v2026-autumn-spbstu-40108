export function countOccurrences(arr) {
  let result = {};

  for (let item of arr) {
    result[item] = (result[item] || 0) + 1;
  }

  return result;
}

export function findPairsWithSum(values, target) {
  const pairs = [];
  const seenPairs = new Set();

  for (let firstIndex = 0; firstIndex < values.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < values.length;
      secondIndex += 1
    ) {
      if (values[firstIndex] + values[secondIndex] !== target) {
        continue;
      }

      const pair = [values[firstIndex], values[secondIndex]].sort(
        (first, second) => first - second,
      );
      const key = JSON.stringify(pair);
      if (!seenPairs.has(key)) {
        seenPairs.add(key);
        pairs.push(pair);
      }
    }
  }

  return pairs;
}

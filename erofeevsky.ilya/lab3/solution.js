export function sortByFrequency(arr) {
  const countMap = {};
  for (const num of arr) {
    countMap[num] = (countMap[num] || 0) + 1;
  }
  return [...arr].sort((a, b) => {
    if (countMap[b] === countMap[a]) {
      return a - b;
    }
    return countMap[b] - countMap[a];
  });
}

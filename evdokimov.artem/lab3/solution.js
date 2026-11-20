export function findMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const length = sorted.length;

  if (length % 2 !== 0) {
    const middle = (length - 1) / 2;
    return sorted[middle];
  }

  const middle = length / 2;
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

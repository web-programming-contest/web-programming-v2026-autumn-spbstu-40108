export function findLongestIncreasingSubsequence(arr) {
  if (arr.length === 0) {
    return 0;
  }

  const lengths = [];

  for (let i = 0; i < arr.length; i++) {
    lengths.push(1);

    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        lengths[i] = Math.max(lengths[i], lengths[j] + 1);
      }
    }
  }

  return Math.max(...lengths);
}

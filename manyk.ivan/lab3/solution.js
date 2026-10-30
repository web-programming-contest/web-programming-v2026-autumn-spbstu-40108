export function slidingWindowSums(arr, k) {
  if (k <= 0 || k > arr.length) {
    return [];
  }

  const result = [];
  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  result.push(windowSum);

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    result.push(windowSum);
  }

  return result;
}

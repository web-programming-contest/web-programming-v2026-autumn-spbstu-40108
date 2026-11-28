export function findMaxSubarraySum(arr, n) {
  let sum = 0;

  for (let i = 0; i < n; i++) {
    sum += arr[i];
  }

  let maxSum = sum;

  for (let i = n; i < arr.length; i++) {
    sum += arr[i] - arr[i - n];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}

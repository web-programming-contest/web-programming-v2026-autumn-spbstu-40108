export function findMissingNumber(arr) {
  const n = arr.length + 1;
  const totalSumArr = (n * (n + 1)) / 2;

  let actualSumArr = 0;

  for (let i = 0; i < arr.length; i++) {
    actualSumArr += arr[i];
  }

  return totalSumArr - actualSumArr;
}

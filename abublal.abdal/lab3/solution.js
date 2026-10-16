/**
 * Rotates an array to the right by the given number of steps.
 * Returns a new array; does not mutate the input.
 * @param {Array} arr - Source array.
 * @param {number} steps - Number of positions to shift to the right.
 * @returns {Array} New rotated array.
 */
export function rotateArray(arr, steps) {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }

  if (arr.length === 0) {
    return [];
  }

  const normalizedSteps = ((steps % arr.length) + arr.length) % arr.length;

  if (normalizedSteps === 0) {
    return arr.slice();
  }

  return arr.slice(-normalizedSteps).concat(arr.slice(0, -normalizedSteps));
}

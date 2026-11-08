/**
 * Converts an integer (1–3999) to its Roman numeral representation.
 * @param {number} value - Integer in range [1, 3999].
 * @returns {string} Roman numeral string.
 */
export function toRoman(value) {
  if (!Number.isInteger(value) || value < 1 || value > 3999) {
    throw new RangeError('Value must be an integer between 1 and 3999');
  }

  const table = [
    {value: 1000, symbol: 'M'},
    {value: 900, symbol: 'CM'},
    {value: 500, symbol: 'D'},
    {value: 400, symbol: 'CD'},
    {value: 100, symbol: 'C'},
    {value: 90, symbol: 'XC'},
    {value: 50, symbol: 'L'},
    {value: 40, symbol: 'XL'},
    {value: 10, symbol: 'X'},
    {value: 9, symbol: 'IX'},
    {value: 5, symbol: 'V'},
    {value: 4, symbol: 'IV'},
    {value: 1, symbol: 'I'},
  ];

  let remaining = value;
  let result = '';

  for (const {value: v, symbol} of table) {
    while (remaining >= v) {
      result += symbol;
      remaining -= v;
    }
  }

  return result;
}

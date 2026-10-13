export function countVowels(str) {
  if (typeof str !== 'string') {
    return 0;
  }

  let count = 0;
  for (const char of str.toLowerCase()) {   // приводим строку к нижнему регистру
    if ('aeiou'.includes(char)) {           
      count++;
    }
  }
  return count;
}

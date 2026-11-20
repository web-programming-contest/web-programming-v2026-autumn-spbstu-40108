export function isPangram(str) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const text = str.toLowerCase();

  for (const letter of alphabet) {
    if (!text.includes(letter)) {
      return false;
    }
  }

  return true;
}

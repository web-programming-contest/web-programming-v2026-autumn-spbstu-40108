export function isBalanced(input) {
  const matchingOpen = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);
  const openings = new Set(matchingOpen.values());
  const stack = [];

  for (const character of input) {
    if (openings.has(character)) {
      stack.push(character);
    } else if (
      matchingOpen.has(character) &&
      stack.pop() !== matchingOpen.get(character)
    ) {
      return false;
    }
  }

  return stack.length === 0;
}

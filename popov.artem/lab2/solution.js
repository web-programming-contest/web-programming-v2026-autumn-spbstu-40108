export function formatPhoneNumber(phoneStr) {
  if (typeof phoneStr !== 'string') {
    throw new TypeError('Номер должен быть строкой');
  }

  if (phoneStr.length !== 10) {
    throw new Error('Номер должен содержать 10 цифр');
  }

  for (const symbol of phoneStr) {
    if (symbol < '0' || symbol > '9') {
      throw new Error('Номер должен содержать только цифры');
    }
  }

  const operatorCode = phoneStr.slice(0, 3);
  const firstPart = phoneStr.slice(3, 6);
  const secondPart = phoneStr.slice(6, 8);
  const thirdPart = phoneStr.slice(8, 10);

  return `+7 (${operatorCode}) ${firstPart}-${secondPart}-${thirdPart}`;
}

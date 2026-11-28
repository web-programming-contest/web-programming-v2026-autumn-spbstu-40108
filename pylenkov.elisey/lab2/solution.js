export function generatePrimes(n) {
  const primes = [];

  for (let number = 2; number <= n; number++) {
    let isPrime = true;

    for (let divisor = 2; divisor * divisor <= number; divisor++) {
      if (number % divisor === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primes.push(number);
    }
  }

  return primes;
}

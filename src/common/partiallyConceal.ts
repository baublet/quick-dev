export function partiallyConceal(str: string): string {
  const first3 = str.substring(0, 3);
  const last3 = str.substring(str.length - 3);

  const difference = Math.max(Math.min(str.length - 6, 7), 7);

  return [first3, ...Array(difference).fill("*"), last3].join("");
}

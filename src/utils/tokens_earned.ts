export function getTokensEarnedString(tokens: number): string {
  const hasDecimals = (tokens * 100) % 100 > 0;

  if (!hasDecimals) {
    return `${tokens}`;
  }

  return tokens.toFixed(2);
}

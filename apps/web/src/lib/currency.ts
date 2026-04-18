// Fixed exchange rate: 1 EUR ≈ 1.08 USD
const EUR_TO_USD = 1.08;

function isUSLocale(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith('America/')) return true;
  } catch {
    // ignore
  }
  return navigator.language.startsWith('en-US');
}

function fmtCompact(n: number, symbol: string): string {
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(1)}K`;
  return `${symbol}${n.toFixed(2)}`;
}

/** Format an amount as EUR, with approx USD in parentheses for US users. */
export function formatMoney(amount: number): string {
  const eur = `€${amount.toFixed(2)}`;
  if (!isUSLocale()) return eur;
  return `${eur} (≈ $${(amount * EUR_TO_USD).toFixed(2)})`;
}

/** Compact version (K/M) for stat cards and summaries. */
export function formatMoneyCompact(amount: number): string {
  const eur = fmtCompact(amount, '€');
  if (!isUSLocale()) return eur;
  return `${eur} (≈ ${fmtCompact(amount * EUR_TO_USD, '$')})`;
}

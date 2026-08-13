export function fixCurrency(priceCents) {
  return (priceCents / 100).toFixed(2)
}
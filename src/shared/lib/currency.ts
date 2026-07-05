/** Currency math + formatting for donations. All amounts are USD. */

import { DONATION } from '../config/app-config'

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Round to cents to avoid floating-point drift in displayed money. */
function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100
}

/** Format a USD amount, e.g. `1234.5` → `"$1,234.50"`. */
export function formatUSD(amount: number): string {
  return usdFormatter.format(amount)
}

/** Clamp a raw slider value into the allowed donation range. */
export function clampAmount(amount: number): number {
  if (Number.isNaN(amount)) return DONATION.MIN
  return Math.min(DONATION.MAX, Math.max(DONATION.MIN, amount))
}

/** Platform fee (2.5%) added on top of the base amount. */
export function computeFee(amount: number): number {
  return roundToCents(amount * DONATION.FEE_RATE)
}

/** Total the donor pays: base amount + fee. */
export function computeTotal(amount: number): number {
  return roundToCents(amount + computeFee(amount))
}

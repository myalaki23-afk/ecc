/** Static configuration and seed data for the Charity Donation & Rewards app. */

import type { Charity, Prize } from '../types/domain'

/** Donation slider + fee constants. */
export const DONATION = {
  /** Minimum donation in USD. */
  MIN: 10,
  /** Maximum donation in USD. */
  MAX: 500,
  /** Slider increment in USD. */
  STEP: 5,
  /** Initial slider value in USD. */
  DEFAULT: 50,
  /** Platform fee rate, applied on top of the base amount. */
  FEE_RATE: 0.025,
} as const

/** Simulated network latency for the mock auth flow, in milliseconds. */
export const AUTH_MOCK_DELAY_MS = 1500

/** Charities a donor can support. */
export const CHARITIES: readonly Charity[] = [
  {
    id: 'clean-water',
    name: 'Clean Water Fund',
    description: 'Wells and filtration for communities without safe drinking water.',
  },
  {
    id: 'food-relief',
    name: 'Global Food Relief',
    description: 'Emergency meals and long-term nutrition programs.',
  },
  {
    id: 'tree-planting',
    name: 'Reforest Earth',
    description: 'Native tree planting to restore degraded landscapes.',
  },
] as const

/**
 * Wheel-of-fortune slices, in visual order.
 * `nothing` slices keep the wheel honest; `points`/`voucher` award ledger rewards.
 */
export const WHEEL_PRIZES: readonly Prize[] = [
  { id: 'w-100pts', label: '100 Points', kind: 'points', value: 100 },
  { id: 'w-miss-1', label: 'Try Again', kind: 'nothing', value: 0 },
  { id: 'w-5off', label: '$5 Voucher', kind: 'voucher', value: 5 },
  { id: 'w-250pts', label: '250 Points', kind: 'points', value: 250 },
  { id: 'w-miss-2', label: 'Try Again', kind: 'nothing', value: 0 },
  { id: 'w-10off', label: '$10 Voucher', kind: 'voucher', value: 10 },
  { id: 'w-500pts', label: '500 Points', kind: 'points', value: 500 },
  { id: 'w-miss-3', label: 'Try Again', kind: 'nothing', value: 0 },
] as const

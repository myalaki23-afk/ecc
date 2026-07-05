/** Core domain models for the Charity Donation & Rewards app. */

export interface Charity {
  readonly id: string
  readonly name: string
  readonly description: string
}

export type PrizeKind = 'points' | 'voucher' | 'nothing'

export interface Prize {
  readonly id: string
  readonly label: string
  readonly kind: PrizeKind
  /** Points awarded, or voucher dollar value. `0` for a no-prize slice. */
  readonly value: number
}

export interface Donation {
  readonly charityId: string
  readonly charityName: string
  /** Base donation amount in USD (slider value). */
  readonly amount: number
  /** 2.5% platform fee, added on top of `amount`. */
  readonly fee: number
  /** `amount + fee` — the total the donor pays. */
  readonly total: number
}

interface LedgerEntryBase {
  readonly id: string
  /** ISO-8601 timestamp, e.g. `2026-07-04T12:00:00.000Z`. */
  readonly createdAt: string
}

export interface DonationLedgerEntry extends LedgerEntryBase {
  readonly type: 'donation'
  readonly donation: Donation
}

export interface RewardLedgerEntry extends LedgerEntryBase {
  readonly type: 'reward'
  readonly prize: Prize
}

export type LedgerEntry = DonationLedgerEntry | RewardLedgerEntry

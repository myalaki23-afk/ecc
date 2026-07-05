/**
 * Singleton append-only ledger. Every entry is deep-cloned on insert, so a
 * caller can never mutate recorded history through a retained reference.
 * Newest entries are stored first for display.
 */
import { computed, readonly, ref } from 'vue'
import { deepClone } from '../../../shared/lib/clone'
import type {
  Donation,
  DonationLedgerEntry,
  LedgerEntry,
  Prize,
  RewardLedgerEntry,
} from '../../../shared/types/domain'

// --- module-level singleton state ---
const entries = ref<LedgerEntry[]>([])

function nextId(): string {
  return crypto.randomUUID()
}

function nowIso(): string {
  return new Date().toISOString()
}

export function useLedger() {
  const donationEntries = computed(() =>
    entries.value.filter((entry): entry is DonationLedgerEntry => entry.type === 'donation'),
  )
  const rewardEntries = computed(() =>
    entries.value.filter((entry): entry is RewardLedgerEntry => entry.type === 'reward'),
  )

  const totalDonated = computed(() =>
    donationEntries.value.reduce((sum, entry) => sum + entry.donation.total, 0),
  )
  const totalPoints = computed(() =>
    rewardEntries.value
      .filter((entry) => entry.prize.kind === 'points')
      .reduce((sum, entry) => sum + entry.prize.value, 0),
  )

  function append(entry: LedgerEntry): void {
    entries.value = [deepClone(entry), ...entries.value]
  }

  function addDonation(donation: Donation): DonationLedgerEntry {
    const entry: DonationLedgerEntry = {
      id: nextId(),
      createdAt: nowIso(),
      type: 'donation',
      donation,
    }
    append(entry)
    return entry
  }

  function addReward(prize: Prize): RewardLedgerEntry {
    const entry: RewardLedgerEntry = {
      id: nextId(),
      createdAt: nowIso(),
      type: 'reward',
      prize,
    }
    append(entry)
    return entry
  }

  return {
    entries: readonly(entries),
    donationEntries,
    rewardEntries,
    totalDonated,
    totalPoints,
    addDonation,
    addReward,
  }
}

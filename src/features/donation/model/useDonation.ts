/**
 * Per-instance donation form state: charity selection, slider amount, and the
 * derived 2.5% fee / total. `buildDonation` snapshots the current values into an
 * immutable Donation for the ledger.
 */
import { computed, ref } from 'vue'
import { CHARITIES, DONATION } from '../../../shared/config/app-config'
import { clampAmount, computeFee, computeTotal } from '../../../shared/lib/currency'
import type { Charity, Donation } from '../../../shared/types/domain'

export function useDonation() {
  const selectedCharityId = ref<string>(CHARITIES[0].id)
  const amount = ref<number>(DONATION.DEFAULT)

  const selectedCharity = computed<Charity>(
    () => CHARITIES.find((charity) => charity.id === selectedCharityId.value) ?? CHARITIES[0],
  )

  const fee = computed(() => computeFee(amount.value))
  const total = computed(() => computeTotal(amount.value))

  function setAmount(next: number): void {
    amount.value = clampAmount(next)
  }

  function selectCharity(id: string): void {
    selectedCharityId.value = id
  }

  /** Snapshot the current selection into an immutable Donation. */
  function buildDonation(): Donation {
    const charity = selectedCharity.value
    const base = amount.value
    return {
      charityId: charity.id,
      charityName: charity.name,
      amount: base,
      fee: computeFee(base),
      total: computeTotal(base),
    }
  }

  return {
    charities: CHARITIES,
    selectedCharityId,
    selectedCharity,
    amount,
    fee,
    total,
    min: DONATION.MIN,
    max: DONATION.MAX,
    step: DONATION.STEP,
    setAmount,
    selectCharity,
    buildDonation,
  }
}

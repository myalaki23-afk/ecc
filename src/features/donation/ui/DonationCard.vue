<script setup lang="ts">
import BaseButton from '../../../shared/ui/BaseButton.vue'
import { formatUSD } from '../../../shared/lib/currency'
import type { Donation } from '../../../shared/types/domain'
import { useAuth } from '../../auth/model/useAuth'
import { useDonation } from '../model/useDonation'

const emit = defineEmits<{ committed: [donation: Donation] }>()

const {
  charities,
  selectedCharityId,
  selectedCharity,
  amount,
  fee,
  total,
  min,
  max,
  step,
  setAmount,
  buildDonation,
} = useDonation()

const { runWhenAuthenticated } = useAuth()

function onAmountInput(event: Event): void {
  setAmount(Number((event.target as HTMLInputElement).value))
}

function onDonate(): void {
  const donation = buildDonation()
  // Authenticated → commits immediately; otherwise stashed + replayed post-login.
  runWhenAuthenticated(() => emit('committed', donation))
}
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">Make a donation</h2>
    <p class="mt-1 text-sm text-slate-500">{{ selectedCharity.description }}</p>

    <label class="mt-5 block text-sm font-medium text-slate-700" for="charity">Charity</label>
    <select
      id="charity"
      v-model="selectedCharityId"
      class="mt-1 w-full rounded-lg py-2 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-500"
    >
      <option v-for="charity in charities" :key="charity.id" :value="charity.id">
        {{ charity.name }}
      </option>
    </select>

    <div class="mt-5 flex items-baseline justify-between">
      <label class="text-sm font-medium text-slate-700" for="amount">Amount</label>
      <span class="text-2xl font-bold text-indigo-600">{{ formatUSD(amount) }}</span>
    </div>
    <input
      id="amount"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="amount"
      class="mt-2 w-full accent-indigo-600"
      @input="onAmountInput"
    />
    <div class="flex justify-between text-xs text-slate-400">
      <span>{{ formatUSD(min) }}</span>
      <span>{{ formatUSD(max) }}</span>
    </div>

    <dl class="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm">
      <div class="flex justify-between text-slate-600">
        <dt>Donation</dt>
        <dd>{{ formatUSD(amount) }}</dd>
      </div>
      <div class="flex justify-between text-slate-600">
        <dt>Platform fee (2.5%)</dt>
        <dd>{{ formatUSD(fee) }}</dd>
      </div>
      <div class="flex justify-between font-semibold text-slate-900">
        <dt>Total</dt>
        <dd>{{ formatUSD(total) }}</dd>
      </div>
    </dl>

    <BaseButton class="mt-5" block @click="onDonate">
      Donate {{ formatUSD(total) }}
    </BaseButton>
  </section>
</template>

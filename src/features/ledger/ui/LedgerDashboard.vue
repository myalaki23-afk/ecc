<script setup lang="ts">
import { formatUSD } from '../../../shared/lib/currency'
import { useLedger } from '../model/useLedger'

const { entries, totalDonated, totalPoints } = useLedger()

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">Activity</h2>

    <div class="mt-4 grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-indigo-50 p-4">
        <dt class="text-xs font-medium uppercase tracking-wide text-indigo-500">Total donated</dt>
        <dd class="mt-1 text-xl font-bold text-indigo-700">{{ formatUSD(totalDonated) }}</dd>
      </div>
      <div class="rounded-xl bg-amber-50 p-4">
        <dt class="text-xs font-medium uppercase tracking-wide text-amber-500">Reward points</dt>
        <dd class="mt-1 text-xl font-bold text-amber-700">{{ totalPoints }}</dd>
      </div>
    </div>

    <p v-if="entries.length === 0" class="mt-6 text-center text-sm text-slate-400">
      No activity yet — make a donation or spin the wheel.
    </p>

    <ul v-else class="mt-4 divide-y divide-slate-100">
      <li v-for="entry in entries" :key="entry.id" class="flex items-center gap-3 py-3">
        <template v-if="entry.type === 'donation'">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">♥</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-slate-800">{{ entry.donation.charityName }}</p>
            <p class="text-xs text-slate-400">
              {{ formatUSD(entry.donation.amount) }} + {{ formatUSD(entry.donation.fee) }} fee ·
              {{ formatTime(entry.createdAt) }}
            </p>
          </div>
          <span class="text-sm font-semibold text-slate-900">{{ formatUSD(entry.donation.total) }}</span>
        </template>

        <template v-else>
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">★</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-slate-800">{{ entry.prize.label }}</p>
            <p class="text-xs text-slate-400">Wheel reward · {{ formatTime(entry.createdAt) }}</p>
          </div>
          <span class="text-sm font-semibold text-amber-600">
            {{ entry.prize.kind === 'voucher' ? formatUSD(entry.prize.value) : `+${entry.prize.value}` }}
          </span>
        </template>
      </li>
    </ul>
  </section>
</template>

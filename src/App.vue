<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './shared/ui/BaseButton.vue'
import type { Donation, Prize } from './shared/types/domain'
import { useAuth } from './features/auth/model/useAuth'
import { useLedger } from './features/ledger/model/useLedger'
import LoginModal from './features/auth/ui/LoginModal.vue'
import DonationCard from './features/donation/ui/DonationCard.vue'
import LedgerDashboard from './features/ledger/ui/LedgerDashboard.vue'
import WheelOfFortune from './features/wheel/ui/WheelOfFortune.vue'

const { user, isAuthenticated, logout } = useAuth()
const { addDonation, addReward } = useLedger()

// v-if toggle: unmounting the wheel proves the composable's rAF teardown.
const showWheel = ref(true)

function onDonationCommitted(donation: Donation): void {
  addDonation(donation)
}

function onPrizeWon(prize: Prize): void {
  addReward(prize)
}
</script>

<template>
  <div class="min-h-svh bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <h1 class="text-xl font-bold tracking-tight">Charity Donation &amp; Rewards</h1>
          <p class="text-sm text-slate-500">Give, then spin for bonus rewards.</p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="isAuthenticated" class="text-sm text-slate-600">
            Hi, <span class="font-medium text-slate-900">{{ user?.name }}</span>
          </span>
          <BaseButton v-if="isAuthenticated" variant="ghost" @click="logout">Sign out</BaseButton>
          <span v-else class="text-sm text-slate-400">Not signed in</span>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-6">
          <DonationCard @committed="onDonationCommitted" />

          <div>
            <div class="mb-3 flex justify-end">
              <BaseButton variant="secondary" @click="showWheel = !showWheel">
                {{ showWheel ? 'Hide wheel' : 'Show wheel' }}
              </BaseButton>
            </div>
            <WheelOfFortune v-if="showWheel" @won="onPrizeWon" />
            <p v-else class="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 ring-1 ring-slate-200">
              Wheel unmounted — its animation frame was cancelled cleanly.
            </p>
          </div>
        </div>

        <LedgerDashboard />
      </div>
    </main>

    <LoginModal />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '../../../shared/ui/BaseButton.vue'
import type { Prize } from '../../../shared/types/domain'
import { useWheelOfFortune } from '../model/useWheelOfFortune'

const emit = defineEmits<{ won: [prize: Prize] }>()

const { prizes, sliceAngle, angle, isSpinning, result, spin } = useWheelOfFortune((prize) => {
  // "nothing" slices are honest misses — no ledger reward.
  if (prize.kind !== 'nothing') emit('won', prize)
})

const CENTER = 100
const RADIUS = 95
const LABEL_RADIUS = 60
const SLICE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#14b8a6']

/** Point on the wheel at `deg` clockwise from the top. */
function polar(deg: number, radius: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180
  return { x: CENTER + radius * Math.sin(rad), y: CENTER - radius * Math.cos(rad) }
}

interface Wedge {
  readonly id: string
  readonly label: string
  readonly path: string
  readonly labelX: number
  readonly labelY: number
  readonly labelAngle: number
  readonly fill: string
}

const wedges = computed<Wedge[]>(() =>
  prizes.map((prize, index) => {
    const start = index * sliceAngle
    const end = start + sliceAngle
    const mid = start + sliceAngle / 2
    const outerStart = polar(start, RADIUS)
    const outerEnd = polar(end, RADIUS)
    const label = polar(mid, LABEL_RADIUS)
    return {
      id: prize.id,
      label: prize.label,
      path: `M ${CENTER} ${CENTER} L ${outerStart.x} ${outerStart.y} A ${RADIUS} ${RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y} Z`,
      labelX: label.x,
      labelY: label.y,
      labelAngle: mid,
      fill: SLICE_COLORS[index % SLICE_COLORS.length],
    }
  }),
)
</script>

<template>
  <section class="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">Wheel of Fortune</h2>
    <p class="mt-1 text-sm text-slate-500">Spin for bonus reward points and vouchers.</p>

    <div class="relative mt-5 h-64 w-64">
      <!-- fixed pointer at the top -->
      <div
        class="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-1"
        style="border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid #0f172a"
        aria-hidden="true"
      />
      <svg viewBox="0 0 200 200" class="h-64 w-64 drop-shadow">
        <g :transform="`rotate(${angle} ${CENTER} ${CENTER})`">
          <path
            v-for="wedge in wedges"
            :key="wedge.id"
            :d="wedge.path"
            :fill="wedge.fill"
            stroke="white"
            stroke-width="1"
          />
          <text
            v-for="wedge in wedges"
            :key="`${wedge.id}-label`"
            :x="wedge.labelX"
            :y="wedge.labelY"
            :transform="`rotate(${wedge.labelAngle} ${wedge.labelX} ${wedge.labelY})`"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
            font-size="7"
            font-weight="600"
          >
            {{ wedge.label }}
          </text>
        </g>
        <circle :cx="CENTER" :cy="CENTER" r="10" fill="white" stroke="#e2e8f0" stroke-width="2" />
      </svg>
    </div>

    <BaseButton class="mt-5" :loading="isSpinning" :disabled="isSpinning" @click="spin">
      {{ isSpinning ? 'Spinning…' : 'Spin the wheel' }}
    </BaseButton>

    <p v-if="result && !isSpinning" class="mt-4 text-sm font-medium text-slate-700">
      <template v-if="result.kind === 'nothing'">No prize this time — spin again!</template>
      <template v-else>You won: <span class="font-bold text-indigo-600">{{ result.label }}</span> 🎉</template>
    </p>
  </section>
</template>

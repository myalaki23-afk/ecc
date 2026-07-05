/**
 * requestAnimationFrame-driven wheel spin.
 *
 * Teardown: an in-flight animation frame is cancelled on unmount, so removing
 * the wheel (e.g. via `v-if`) leaves no dangling rAF callback or listener.
 */
import { onUnmounted, readonly, ref } from 'vue'
import { WHEEL_PRIZES } from '../../../shared/config/app-config'
import type { Prize } from '../../../shared/types/domain'

const SPIN_DURATION_MS = 4000
const FULL_TURNS = 5

/** Decelerating ease so the wheel slows to a stop. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360
}

export function useWheelOfFortune(onResult?: (prize: Prize) => void) {
  const prizes = WHEEL_PRIZES
  const sliceCount = prizes.length
  const sliceAngle = 360 / sliceCount

  const angle = ref(0)
  const isSpinning = ref(false)
  const result = ref<Prize | null>(null)

  let rafId: number | null = null
  let startTime: number | null = null
  let startAngle = 0
  let targetAngle = 0
  let targetPrize: Prize | null = null

  function stop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    startTime = null
  }

  function frame(now: number): void {
    if (startTime === null) startTime = now
    const t = Math.min((now - startTime) / SPIN_DURATION_MS, 1)
    angle.value = startAngle + (targetAngle - startAngle) * easeOutCubic(t)

    if (t < 1) {
      rafId = requestAnimationFrame(frame)
      return
    }

    stop()
    angle.value = targetAngle
    isSpinning.value = false
    if (targetPrize) {
      result.value = targetPrize
      onResult?.(targetPrize)
    }
  }

  function spin(): void {
    if (isSpinning.value) return
    result.value = null

    const index = Math.floor(Math.random() * sliceCount)
    targetPrize = prizes[index]

    // Pointer sits at the top (0deg). Align the chosen slice's center under it.
    const sliceCenter = index * sliceAngle + sliceAngle / 2
    const desiredMod = normalizeDegrees(360 - sliceCenter)
    const currentMod = normalizeDegrees(angle.value)
    const delta = normalizeDegrees(desiredMod - currentMod)

    startAngle = angle.value
    targetAngle = angle.value + FULL_TURNS * 360 + delta

    isSpinning.value = true
    startTime = null
    rafId = requestAnimationFrame(frame)
  }

  onUnmounted(stop)

  return {
    prizes,
    sliceAngle,
    angle: readonly(angle),
    isSpinning: readonly(isSpinning),
    result: readonly(result),
    spin,
  }
}

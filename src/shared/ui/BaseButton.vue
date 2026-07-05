<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props {
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const {
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  block = false,
} = defineProps<Props>()

const emit = defineEmits<{ click: [] }>()

const isDisabled = computed(() => disabled || loading)

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary:
    'bg-white text-indigo-700 ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 focus-visible:outline-indigo-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold',
  'transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  block ? 'w-full' : '',
  variantClasses[variant],
])

function onClick(): void {
  if (isDisabled.value) return
  emit('click')
}
</script>

<template>
  <button :type="type" :class="classes" :disabled="isDisabled" @click="onClick">
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

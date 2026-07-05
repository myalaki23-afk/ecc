<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

interface Props {
  title?: string
  closeOnBackdrop?: boolean
}

const { title = '', closeOnBackdrop = true } = defineProps<Props>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [] }>()

function close(): void {
  open.value = false
  emit('close')
}

function onBackdrop(): void {
  if (closeOnBackdrop) close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title || undefined"
      >
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="onBackdrop" />
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <header v-if="title" class="mb-4">
            <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
          </header>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

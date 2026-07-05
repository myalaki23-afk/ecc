<script setup lang="ts">
import BaseModal from '../../../shared/ui/BaseModal.vue'
import BaseButton from '../../../shared/ui/BaseButton.vue'
import { useAuth } from '../model/useAuth'

const { loginPromptOpen, isAuthenticating, login, cancelPending } = useAuth()

async function onSignIn(): Promise<void> {
  // On success, login() closes the prompt and replays the pending donation.
  await login()
}

function onCancel(): void {
  cancelPending()
}
</script>

<template>
  <BaseModal
    v-model:open="loginPromptOpen"
    title="Sign in to donate"
    :close-on-backdrop="!isAuthenticating"
    @close="onCancel"
  >
    <p class="mb-6 text-sm text-slate-600">
      This is a mock sign-in. We’ll authenticate you (about 1.5&nbsp;seconds), then
      finish your pending donation automatically.
    </p>
    <div class="flex justify-end gap-3">
      <BaseButton variant="ghost" :disabled="isAuthenticating" @click="onCancel">
        Cancel
      </BaseButton>
      <BaseButton :loading="isAuthenticating" @click="onSignIn">
        {{ isAuthenticating ? 'Signing in…' : 'Sign in' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

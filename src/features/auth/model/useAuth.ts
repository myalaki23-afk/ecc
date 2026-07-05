/**
 * Singleton mock-auth store composable.
 *
 * Interception model: when an unauthenticated user triggers a gated action
 * (e.g. donating), the action is stashed and the login prompt opens. After a
 * simulated ~1.5s sign-in the stashed action replays automatically.
 */
import { computed, readonly, ref } from 'vue'
import { AUTH_MOCK_DELAY_MS } from '../../../shared/config/app-config'

export interface AuthUser {
  readonly id: string
  readonly name: string
  readonly email: string
}

const MOCK_USER: AuthUser = {
  id: 'donor-1',
  name: 'Alex Donor',
  email: 'alex@example.com',
}

// --- module-level singleton state (shared across all callers) ---
const currentUser = ref<AuthUser | null>(null)
const isAuthenticating = ref(false)
const loginPromptOpen = ref(false)

/** Action captured while unauthenticated, replayed once sign-in completes. */
let pendingAction: (() => void) | null = null

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)

  async function login(): Promise<void> {
    if (isAuthenticating.value || isAuthenticated.value) return
    isAuthenticating.value = true
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, AUTH_MOCK_DELAY_MS))
      currentUser.value = MOCK_USER
    } finally {
      isAuthenticating.value = false
    }

    loginPromptOpen.value = false

    // Replay the action intercepted before login, if any.
    const action = pendingAction
    pendingAction = null
    action?.()
  }

  function logout(): void {
    currentUser.value = null
    pendingAction = null
    loginPromptOpen.value = false
  }

  /**
   * Run `action` immediately when authenticated. Otherwise stash it, open the
   * login prompt, and return `false` so the caller knows sign-in is required.
   */
  function runWhenAuthenticated(action: () => void): boolean {
    if (isAuthenticated.value) {
      action()
      return true
    }
    pendingAction = action
    loginPromptOpen.value = true
    return false
  }

  /** Discard any stashed action and close the prompt (user cancelled sign-in). */
  function cancelPending(): void {
    pendingAction = null
    loginPromptOpen.value = false
  }

  return {
    user: readonly(currentUser),
    isAuthenticated,
    isAuthenticating: readonly(isAuthenticating),
    loginPromptOpen,
    login,
    logout,
    runWhenAuthenticated,
    cancelPending,
  }
}

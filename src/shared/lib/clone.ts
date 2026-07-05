/**
 * Structural deep clone. Used by the append-only ledger so stored entries can
 * never be mutated by reference from the caller that produced them.
 */
export function deepClone<T>(value: T): T {
  return structuredClone(value)
}

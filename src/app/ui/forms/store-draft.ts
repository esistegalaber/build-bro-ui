import {effect, linkedSignal, untracked} from '@angular/core'

/** How long a typed field (such as a build number) waits after the last keystroke before it counts as changed. */
export const TYPING_PAUSE_MS = 300

/**
 * A draft of a value from the store, for a Signal Form to edit (`form(draft.model, ...)`).
 *
 * - `model` starts over from the store's value whenever the store sends a new one.
 *   Signal Forms never change the value they get: every edit makes a new object, so the
 *   store's (frozen) value stays untouched.
 * - Every change made in the form is passed to `report` once. When the store answers with
 *   the reported value, nothing is reported again.
 * - `send(value)` reports right away, for example on submit; that value isn't reported again either.
 *
 * Call it in an injection context, such as a field initializer of a component.
 */
export function storeDraft<T>(fromStore: () => T, report: (value: T) => void) {
  const model = linkedSignal(fromStore)
  let lastSent: T | null = null
  const send = (value: T) => {
    lastSent = value
    report(value)
  }
  effect(() => {
    const value = model()
    if (value !== fromStore() && value !== lastSent) {
      untracked(() => send(value))
    }
  })
  return {model, send}
}

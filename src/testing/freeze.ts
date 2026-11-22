/** Freezes deeply, as NgRx does with state and actions in dev mode: any change to it throws. */
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}

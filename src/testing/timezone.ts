declare const process: { env: Record<string, string | undefined> }

/**
 * Runs the tests of the surrounding `describe` with the given timezone (an IANA name such as `Europe/Berlin`)
 * as the "browser's" timezone. Node picks up a changed `TZ` right away, so `Date` formats in that zone.
 */
export function inTimeZone(timeZone: string) {
  let before: string | undefined
  beforeAll(() => {
    before = process.env['TZ']
    process.env['TZ'] = timeZone
  })
  afterAll(() => {
    if (before === undefined) {
      delete process.env['TZ']
    } else {
      process.env['TZ'] = before
    }
  })
}

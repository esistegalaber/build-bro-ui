import {TestBed} from '@angular/core/testing'
import {ThemeService} from './theme.service'

describe('ThemeService', () => {
  const KEY = 'build-bruh-theme'
  const currentTheme = () => document.documentElement.dataset['theme']

  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset['theme']
  })

  afterEach(() => vi.restoreAllMocks())

  it('starts with light when nothing is stored', () => {
    const service = TestBed.inject(ThemeService)
    expect(service.theme()).toBe('light')
    expect(currentTheme()).toBe('light')
  })

  it('starts with the stored theme', () => {
    localStorage.setItem(KEY, 'lagoon')
    expect(TestBed.inject(ThemeService).theme()).toBe('lagoon')
    expect(currentTheme()).toBe('lagoon')
  })

  it('ignores a stored value that is not one of our themes', () => {
    localStorage.setItem(KEY, 'halloween')
    expect(TestBed.inject(ThemeService).theme()).toBe('light')
  })

  it('applies and remembers a chosen theme', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    expect(service.theme()).toBe('dark')
    expect(currentTheme()).toBe('dark')
    expect(localStorage.getItem(KEY)).toBe('dark')
  })

  it('still works when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    const service = TestBed.inject(ThemeService)
    expect(service.theme()).toBe('light')
    service.setTheme('dark')
    expect(service.theme()).toBe('dark')
    expect(currentTheme()).toBe('dark')
  })
})

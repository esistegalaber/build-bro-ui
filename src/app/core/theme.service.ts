import {DOCUMENT, Injectable, inject, signal} from '@angular/core';

/** The daisyUI themes defined in src/styles.css. */
export type Theme = 'light' | 'dark' | 'lagoon'

export const THEMES: Theme[] = ['light', 'dark', 'lagoon']

const STORAGE_KEY = 'build-bruh-theme'

/** Applies the theme (data-theme on <html>) and remembers it in the browser between visits. */
@Injectable({providedIn: 'root'})
export class ThemeService {
  private document = inject(DOCUMENT)

  readonly theme = signal<Theme>(this.storedTheme())

  constructor() {
    this.apply(this.theme())
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme)
    this.apply(theme)
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage can be unavailable (private mode, blocked site data); the theme then lasts for this visit only
    }
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme)
  }

  private storedTheme(): Theme {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY)
      return THEMES.includes(stored as Theme) ? stored as Theme : 'light'
    } catch {
      return 'light'
    }
  }
}

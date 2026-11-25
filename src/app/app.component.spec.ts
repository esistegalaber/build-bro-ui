import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {AppComponent} from './app.component'
import {ThemeService} from './core/theme.service'
import {loadBuildStats} from './core/state/stats/stats.state'
import {toggleSideNavState} from './core/state/nav/nav.actions'
import {clearAlert} from './core/state/alerts/alert.actions'
import * as CoreActions from './core/actions'
import {IAlert} from './core'

describe('AppComponent', () => {
  const NO_ALERT: IAlert = {type: '', heading: '', message: ''}

  function render(alert: IAlert = NO_ALERT) {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideMockStore({initialState: {alert, nav: {sidenav: {text: true}}}})
      ]
    })
    const store = TestBed.inject(MockStore)
    const dispatched = vi.spyOn(store, 'dispatch')
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {fixture, dispatched, byTestId}
  }

  it('loads the stats, projects, servers and label definitions on start', () => {
    const {dispatched} = render()
    expect(dispatched).toHaveBeenCalledWith(loadBuildStats())
    expect(dispatched).toHaveBeenCalledWith(CoreActions.loadProjects())
    expect(dispatched).toHaveBeenCalledWith(CoreActions.loadServers())
    expect(dispatched).toHaveBeenCalledWith(CoreActions.loadLabelDefinitions())
  })

  it('shows the side nav with the labels from the store', () => {
    const {byTestId} = render()
    expect(byTestId('side-nav-toggle').getAttribute('aria-expanded')).toBe('true')
    expect(byTestId('nav-builds')).toBeTruthy()
  })

  it('toggles the side nav labels through the store', () => {
    const {byTestId, dispatched} = render()
    byTestId('side-nav-toggle').click()
    expect(dispatched).toHaveBeenCalledWith(toggleSideNavState())
  })

  it('switches the theme', () => {
    const {byTestId} = render()
    const setTheme = vi.spyOn(TestBed.inject(ThemeService), 'setTheme')
    byTestId('theme-lagoon').click()
    expect(setTheme).toHaveBeenCalledWith('lagoon')
  })

  it('shows an alert and clears it through the store', () => {
    const {byTestId, dispatched} = render({type: 'alert-info', heading: 'Saved', message: 'Successfully saved'})
    expect(byTestId('alert').textContent).toContain('Successfully saved')
    byTestId('alert-ok').click()
    expect(dispatched).toHaveBeenCalledWith(clearAlert())
  })

  it('shows no alert when there is none', () => {
    const {byTestId} = render()
    expect(byTestId('alert')).toBeNull()
  })

  describe('on a phone', () => {
    let listeners: ((event: { matches: boolean }) => void)[]

    beforeEach(() => {
      listeners = []
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.push(listener),
        removeEventListener: vi.fn()
      })
    })
    afterEach(() => {
      delete (window as Partial<Window>).matchMedia
    })

    function renderOnPhone() {
      TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [provideRouter([{path: '**', children: []}]), provideMockStore({initialState: {alert: NO_ALERT, nav: {sidenav: {text: false}}}})]
      })
      const fixture = TestBed.createComponent(AppComponent)
      fixture.detectChanges()
      const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
      const toggle = () => fixture.nativeElement.querySelector('#nav-drawer') as HTMLInputElement
      return {fixture, byTestId, toggle}
    }

    it('shows the labels in the slide-out menu even when collapsed on wide screens', () => {
      const {fixture, byTestId} = renderOnPhone()
      expect(fixture.componentInstance.nav().text).toBe(true)
      expect(byTestId('nav-builds').textContent).toContain('Builds')
      listeners.forEach((l) => l({matches: false}))
      expect(fixture.componentInstance.nav().text).toBe(false)
    })

    it('opens the menu with the focus inside and closes it after choosing a page', async () => {
      const {fixture, byTestId, toggle} = renderOnPhone()
      expect(byTestId('drawer-open').getAttribute('aria-expanded')).toBe('false')
      byTestId('drawer-open').click()
      await fixture.whenStable()
      expect(toggle().checked).toBe(true)
      expect(byTestId('drawer-open').getAttribute('aria-expanded')).toBe('true')
      expect(document.activeElement).toBe(byTestId('drawer-close'))
      byTestId('nav-builds').click()
      await fixture.whenStable()
      expect(toggle().checked).toBe(false)
    })

    it('closes the menu with its button and with Escape, and gives the focus back', async () => {
      const {fixture, byTestId, toggle} = renderOnPhone()
      byTestId('drawer-open').click()
      await fixture.whenStable()
      byTestId('drawer-close').click()
      await fixture.whenStable()
      expect(toggle().checked).toBe(false)
      expect(document.activeElement).toBe(byTestId('drawer-open'))

      byTestId('drawer-open').click()
      await fixture.whenStable()
      byTestId('nav-home').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))
      await fixture.whenStable()
      expect(toggle().checked).toBe(false)
    })

    it('closes the menu when the screen gets wide', async () => {
      const {fixture, byTestId, toggle} = renderOnPhone()
      byTestId('drawer-open').click()
      await fixture.whenStable()
      listeners.forEach((l) => l({matches: false}))
      await fixture.whenStable()
      expect(toggle().checked).toBe(false)
    })

    it('follows the checkbox when the overlay closes the menu', async () => {
      const {fixture, toggle} = renderOnPhone()
      fixture.componentInstance.openMenu()
      await fixture.whenStable()
      toggle().checked = false
      toggle().dispatchEvent(new Event('change'))
      expect(fixture.componentInstance.menuOpen()).toBe(false)
    })
  })
})

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
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
    return {fixture, dispatched, byCy}
  }

  it('loads the stats, projects and servers on start', () => {
    const {dispatched} = render()
    expect(dispatched).toHaveBeenCalledWith(loadBuildStats())
    expect(dispatched).toHaveBeenCalledWith(CoreActions.loadProjects())
    expect(dispatched).toHaveBeenCalledWith(CoreActions.loadServers())
  })

  it('shows the side nav with the labels from the store', () => {
    const {byCy} = render()
    expect(byCy('side-nav-toggle').getAttribute('aria-expanded')).toBe('true')
    expect(byCy('nav-builds')).toBeTruthy()
  })

  it('toggles the side nav labels through the store', () => {
    const {byCy, dispatched} = render()
    byCy('side-nav-toggle').click()
    expect(dispatched).toHaveBeenCalledWith(toggleSideNavState())
  })

  it('switches the theme', () => {
    const {byCy} = render()
    const setTheme = vi.spyOn(TestBed.inject(ThemeService), 'setTheme')
    byCy('theme-lagoon').click()
    expect(setTheme).toHaveBeenCalledWith('lagoon')
  })

  it('shows an alert and clears it through the store', () => {
    const {byCy, dispatched} = render({type: 'alert-info', heading: 'Saved', message: 'Successfully saved'})
    expect(byCy('alert').textContent).toContain('Successfully saved')
    byCy('alert-ok').click()
    expect(dispatched).toHaveBeenCalledWith(clearAlert())
  })

  it('shows no alert when there is none', () => {
    const {byCy} = render()
    expect(byCy('alert')).toBeNull()
  })
})

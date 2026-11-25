import {Component} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {provideRouter, Router} from '@angular/router'
import {SideNav} from './side.nav'
import {Theme} from '../../core/theme.service'

@Component({template: ''})
class EmptyPage {
}

describe('SideNav', () => {
  let fixture: ComponentFixture<SideNav>
  const el = () => fixture.nativeElement as HTMLElement
  const byTestId = (id: string) => el().querySelector(`[data-testid="${id}"]`) as HTMLElement

  async function render(text = true, theme: Theme = 'light') {
    TestBed.configureTestingModule({
      imports: [SideNav],
      providers: [provideRouter([{path: '**', component: EmptyPage}])]
    })
    fixture = TestBed.createComponent(SideNav)
    fixture.componentRef.setInput('sideNav', {text})
    fixture.componentRef.setInput('theme', theme)
    await fixture.whenStable()
  }

  it('shows the logo text and a label for every page', async () => {
    await render(true)
    expect(el().textContent).toContain('Build Bruh')
    const labels = ['nav-home', 'nav-build-sets', 'nav-builds', 'nav-deployments', 'nav-servers', 'nav-projects', 'nav-labels']
      .map((id) => byTestId(id).querySelector('span:last-child')?.textContent?.trim())
    expect(labels).toEqual(['Home', 'Build Sets', 'Builds', 'Deployments', 'Servers', 'Projects', 'Labels'])
    expect(el().querySelectorAll('.sr-only')).toHaveLength(0)
  })

  it('collapsed, shows only icons and keeps the labels for screen readers', async () => {
    await render(false)
    expect(el().textContent).not.toContain('Build Bruh')
    expect(byTestId('nav-builds').querySelector('.sr-only')?.textContent).toBe('Builds')
    expect(byTestId('nav-builds').getAttribute('title')).toBe('Builds')
    expect(byTestId('side-nav-toggle').getAttribute('aria-expanded')).toBe('false')
    expect(byTestId('side-nav-toggle').getAttribute('aria-label')).toBe('Expand the menu')
  })

  it('marks the link of the current page', async () => {
    await render()
    await TestBed.inject(Router).navigateByUrl('/builds')
    await fixture.whenStable()
    expect(byTestId('nav-builds').getAttribute('aria-current')).toBe('page')
    expect(byTestId('nav-home').hasAttribute('aria-current')).toBe(false)
  })

  it('asks to toggle the labels', async () => {
    await render(true)
    const toggled = vi.fn()
    fixture.componentInstance.toggleLabels.subscribe(toggled)
    expect(byTestId('side-nav-toggle').getAttribute('aria-expanded')).toBe('true')
    byTestId('side-nav-toggle').click()
    expect(toggled).toHaveBeenCalledTimes(1)
  })

  it('shows the current theme as pressed and reports a newly chosen one', async () => {
    await render(true, 'lagoon')
    expect(['light', 'dark', 'lagoon'].map((t) => byTestId(`theme-${t}`).getAttribute('aria-pressed')))
      .toEqual(['false', 'false', 'true'])
    const chosen: Theme[] = []
    fixture.componentInstance.themeSelected.subscribe((t) => chosen.push(t))
    byTestId('theme-dark').click()
    expect(chosen).toEqual(['dark'])
  })

  it('labels the theme buttons when collapsed', async () => {
    await render(false)
    expect(byTestId('theme-dark').getAttribute('aria-label')).toBe('Dark')
  })

  it('reports a chosen page and the close button of the slide-out menu', async () => {
    await render()
    let navigated = 0, closed = 0
    fixture.componentInstance.navigated.subscribe(() => navigated++)
    fixture.componentInstance.closeMenu.subscribe(() => closed++)
    byTestId('nav-builds').click()
    byTestId('drawer-close').click()
    expect(navigated).toBe(1)
    expect(closed).toBe(1)
    expect(byTestId('drawer-close').getAttribute('aria-label')).toBe('Close the menu')
  })

  it('moves the focus onto its close button', async () => {
    await render()
    fixture.componentInstance.focusClose()
    expect(document.activeElement).toBe(byTestId('drawer-close'))
  })
})

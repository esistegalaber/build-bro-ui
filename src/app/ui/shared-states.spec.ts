import {Component} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {PageHeader} from './page-header'
import {EmptyState} from './empty-state'
import {Loading} from './loading'

@Component({
  template: `
    <bb-page-header id="with-action" heading="Build sets" description="Named combinations">
      <button type="button" id="action">New</button>
    </bb-page-header>
    <bb-page-header id="plain" heading="Servers"></bb-page-header>
    <bb-empty-state id="in-card" icon="search_off"><p>Nothing here.</p><button type="button">Reset</button></bb-empty-state>
    <bb-empty-state id="framed" framed compact><p>Pick one.</p></bb-empty-state>
    <bb-loading id="loading"></bb-loading>
    <bb-loading id="labelled" label="Loading builds…"></bb-loading>
  `,
  imports: [PageHeader, EmptyState, Loading]
})
class Host {
}

describe('shared page parts', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    return (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement
  }

  it('PageHeader shows title, description and the projected actions', async () => {
    const byId = await render()
    expect(byId('with-action').querySelector('h1')?.textContent).toBe('Build sets')
    expect(byId('with-action').querySelector('p')?.textContent).toBe('Named combinations')
    expect(byId('with-action').querySelector('#action')).toBeTruthy()
    expect(byId('plain').querySelector('p')).toBeNull()
  })

  it('EmptyState shows its icon and content, in a card or as a framed box', async () => {
    const byId = await render()
    expect(byId('in-card').querySelector('.material-icons')?.textContent).toBe('search_off')
    expect(byId('in-card').textContent).toContain('Nothing here.')
    expect(byId('in-card').classList).not.toContain('border-dashed')
    expect(byId('in-card').classList).toContain('py-10')
    expect(byId('framed').querySelector('.material-icons')).toBeNull()
    expect(byId('framed').classList).toContain('border-dashed')
    expect(byId('framed').classList).toContain('text-sm')
  })

  it('Loading tells screen readers what is loading', async () => {
    const byId = await render()
    expect(byId('loading').getAttribute('role')).toBe('status')
    expect(byId('loading').textContent?.trim()).toBe('Loading…')
    expect(byId('labelled').textContent?.trim()).toBe('Loading builds…')
  })
})

import {ComponentFixture, TestBed} from '@angular/core/testing'
import {AlertPanel} from './alert.panel'
import {IAlert} from '../core'
import {INITIAL_ALERT} from '../core/state/alerts/alert.state'

describe('AlertPanel', () => {
  let fixture: ComponentFixture<AlertPanel>
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement

  async function render(alert: IAlert) {
    fixture = TestBed.createComponent(AlertPanel)
    fixture.componentRef.setInput('alert', alert)
    await fixture.whenStable()
  }

  it('shows nothing without a message', async () => {
    await render(INITIAL_ALERT)
    expect(byCy('alert')).toBeNull()
  })

  it('shows an error loudly, with icon, heading and message', async () => {
    await render({type: 'alert-error', heading: 'Not Found', message: 'No build set named x'})
    expect(byCy('alert').getAttribute('role')).toBe('alert')
    expect(byCy('alert').classList).toContain('alert-error')
    expect(byCy('alert').textContent).toContain('error')
    expect(byCy('alert-heading').textContent).toBe('Not Found')
    expect(byCy('alert-message').textContent).toBe('No build set named x')
  })

  it('shows an info politely and leaves out an empty heading', async () => {
    await render({type: 'alert-info', heading: '', message: 'Saved'})
    expect(byCy('alert').getAttribute('role')).toBe('status')
    expect(byCy('alert').classList).toContain('alert-info')
    expect(byCy('alert-heading')).toBeNull()
  })

  it('treats an unknown type as info', async () => {
    await render({type: 'whatever', heading: 'Hi', message: 'there'})
    expect(byCy('alert').classList).toContain('alert-info')
  })

  it('is dismissed with its button', async () => {
    await render({type: 'alert-info', heading: '', message: 'Saved'})
    let dismissed = 0
    fixture.componentInstance.clearAlert.subscribe(() => dismissed++)
    expect(byCy('alert-ok').getAttribute('aria-label')).toBe('Dismiss')
    byCy('alert-ok').click()
    expect(dismissed).toBe(1)
  })
})

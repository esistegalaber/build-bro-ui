import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ServerDetailsForm} from './server-details.form'
import {someServers} from '../../../testing/data'
import {IServer} from '../../core'
import {deepFreeze} from '../../../testing/freeze'

describe('ServerDetailsForm', () => {
  let fixture: ComponentFixture<ServerDetailsForm>
  const byTestId = <T extends HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as T

  async function render(server: IServer | null) {
    fixture = TestBed.createComponent(ServerDetailsForm)
    // frozen, as NgRx hands it over in dev mode
    fixture.componentRef.setInput('server', deepFreeze(server))
    await fixture.whenStable()
  }

  async function type(id: string, value: string) {
    const field = byTestId<HTMLInputElement>(id)
    field.value = value
    field.dispatchEvent(new Event('input'))
    await fixture.whenStable()
  }

  it('asks to choose a server while none is selected', async () => {
    await render(null)
    expect(byTestId('server-none')).toBeTruthy()
    expect(byTestId('server-form')).toBeNull()
  })

  it('shows the values of the chosen server and focuses the nickname', async () => {
    await render(someServers()[0])
    expect(byTestId('server-form').textContent).toContain('Edit testserver')
    expect(byTestId<HTMLInputElement>('server-nickname').value).toBe('Tester')
    expect(byTestId<HTMLTextAreaElement>('server-description').value).toBe('Main Testing Server')
    expect(document.activeElement).toBe(byTestId('server-nickname'))
  })

  it('saves the edited copy and leaves the input alone', async () => {
    const server = someServers()[0]
    await render(server)
    const saved: IServer[] = []
    fixture.componentInstance.updateServer.subscribe((s) => saved.push(s))
    await type('server-nickname', 'Renamed')
    await type('server-description', 'New text')
    byTestId('server-save').click()
    expect(saved).toEqual([{...server, nickName: 'Renamed', description: 'New text'}])
    expect(server.nickName).toBe('Tester')
  })

  it('starts over with the next server', async () => {
    await render(someServers()[0])
    await type('server-nickname', 'Unsaved')
    fixture.componentRef.setInput('server', someServers()[1])
    await fixture.whenStable()
    expect(byTestId<HTMLInputElement>('server-nickname').value).toBe('Company Staging')
  })

  it('cancels with the button and with Escape', async () => {
    await render(someServers()[0])
    let cancelled = 0
    fixture.componentInstance.cancel.subscribe(() => cancelled++)
    byTestId('edit-server-cancel').click()
    byTestId('server-nickname').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))
    expect(cancelled).toBe(2)
  })
})

import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {ServersPage} from './servers.page'
import {allServers} from '../core/state/servers/server.selectors'
import * as CoreActions from '../core/actions'
import {someServers} from '../../testing/data'

describe('ServersPage', () => {
  async function render() {
    TestBed.configureTestingModule({
      imports: [ServersPage],
      providers: [provideMockStore({selectors: [{selector: allServers, value: someServers()}]})]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(ServersPage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    const editStaging = async () => {
      (fixture.nativeElement.querySelector('[data-testid="server-staging"] [data-testid="server-edit"]') as HTMLElement).click()
      await fixture.whenStable()
    }
    return {fixture, dispatched, byTestId, editStaging}
  }

  it('lists the servers and opens no form', async () => {
    const {byTestId} = await render()
    expect(byTestId('server-testserver')).toBeTruthy()
    expect(byTestId('server-staging')).toBeTruthy()
    expect(byTestId('server-none')).toBeTruthy()
  })

  it('edits the chosen server and saves it', async () => {
    const {fixture, dispatched, byTestId, editStaging} = await render()
    await editStaging()
    expect(byTestId('server-staging').getAttribute('aria-current')).toBe('true')
    expect(byTestId('server-form').textContent).toContain('Edit staging')
    byTestId('server-save').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(CoreActions.updateServer({server: someServers()[1]}))
    expect(byTestId('server-form')).toBeNull()
  })

  it('closes the form on cancel without saving', async () => {
    const {fixture, dispatched, byTestId, editStaging} = await render()
    await editStaging()
    byTestId('edit-server-cancel').click()
    await fixture.whenStable()
    expect(byTestId('server-form')).toBeNull()
    expect(dispatched).not.toHaveBeenCalled()
  })
})

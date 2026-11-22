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
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
    const editStaging = async () => {
      (fixture.nativeElement.querySelector('[data-cy-id="server-staging"] [data-cy-id="server-edit"]') as HTMLElement).click()
      await fixture.whenStable()
    }
    return {fixture, dispatched, byCy, editStaging}
  }

  it('lists the servers and opens no form', async () => {
    const {byCy} = await render()
    expect(byCy('server-testserver')).toBeTruthy()
    expect(byCy('server-staging')).toBeTruthy()
    expect(byCy('server-none')).toBeTruthy()
  })

  it('edits the chosen server and saves it', async () => {
    const {fixture, dispatched, byCy, editStaging} = await render()
    await editStaging()
    expect(byCy('server-staging').getAttribute('aria-current')).toBe('true')
    expect(byCy('server-form').textContent).toContain('Edit staging')
    byCy('server-save').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(CoreActions.updateServer({server: someServers()[1]}))
    expect(byCy('server-form')).toBeNull()
  })

  it('closes the form on cancel without saving', async () => {
    const {fixture, dispatched, byCy, editStaging} = await render()
    await editStaging()
    byCy('edit-server-cancel').click()
    await fixture.whenStable()
    expect(byCy('server-form')).toBeNull()
    expect(dispatched).not.toHaveBeenCalled()
  })
})

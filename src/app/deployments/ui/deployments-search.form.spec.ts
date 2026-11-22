import {ComponentFixture, TestBed} from '@angular/core/testing'
import {DeploymentsSearchForm} from './deployments-search.form'
import {INITIAL_DEPLOYMENTS_STATE} from '../state/deployment.reducer'
import {IDeploymentSearch} from '../../core'
import {someServers} from '../../../testing/data'
import {deepFreeze} from '../../../testing/freeze'

describe('DeploymentsSearchForm', () => {
  let fixture: ComponentFixture<DeploymentsSearchForm>
  let updates: IDeploymentSearch[]
  const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T
  const searchWith = (search: Partial<IDeploymentSearch> = {}) =>
    deepFreeze({...structuredClone(INITIAL_DEPLOYMENTS_STATE.search), ...search})

  async function render(search: Partial<IDeploymentSearch> = {}) {
    fixture = TestBed.createComponent(DeploymentsSearchForm)
    fixture.componentRef.setInput('servers', someServers())
    fixture.componentRef.setInput('theSearch', searchWith(search))
    updates = []
    fixture.componentInstance.updateSearch.subscribe((s) => updates.push(s))
    await fixture.whenStable()
  }

  async function choose(id: string, value: string) {
    const select = byCy<HTMLSelectElement>(id)
    select.value = value
    // like a browser: a select fires input, then change
    select.dispatchEvent(new Event('input'))
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('offers all servers with their nicknames and shows the current search', async () => {
    await render({serverName: 'staging', pageSize: 25})
    expect(Array.from(byCy<HTMLSelectElement>('server-select').options).map((o) => o.textContent?.trim()))
      .toEqual(['All servers', 'testserver · Tester', 'staging · Company Staging'])
    expect(byCy<HTMLSelectElement>('server-select').value).toBe('staging')
    expect(byCy<HTMLSelectElement>('page-size-select').value).toBe('25')
  })

  it('searches when a server or page size is chosen, without changing the store\'s search', async () => {
    await render()
    await choose('server-select', 'staging')
    expect(updates.at(-1)).toMatchObject({serverName: 'staging'})
    await choose('page-size-select', '25')
    expect(updates.at(-1)).toMatchObject({serverName: 'staging', pageSize: 25})
    expect(updates).toHaveLength(2)
    expect(fixture.componentInstance.theSearch().serverName).toBe('')
  })

  it('searches only once per change, also after the store has answered', async () => {
    await render()
    await choose('server-select', 'staging')
    fixture.componentRef.setInput('theSearch', deepFreeze(structuredClone(updates[0])))
    await fixture.whenStable()
    expect(updates).toHaveLength(1)
    expect(byCy<HTMLSelectElement>('server-select').value).toBe('staging')
  })

  it('reloads once per click and asks for a reset without searching', async () => {
    await render({serverName: 'staging'})
    let resets = 0
    fixture.componentInstance.resetSearch.subscribe(() => resets++)
    byCy('search-reset').click()
    await fixture.whenStable()
    expect(resets).toBe(1)
    expect(updates).toHaveLength(0)
    byCy('search-reload').click()
    await fixture.whenStable()
    expect(updates).toEqual([expect.objectContaining({serverName: 'staging'})])
  })
})

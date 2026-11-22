import {ComponentFixture, TestBed} from '@angular/core/testing'
import {DeploymentsSearchForm} from './deployments-search.form'
import {INITIAL_DEPLOYMENTS_STATE} from '../state/deployment.reducer'
import {IDeploymentSearch} from '../../core'
import {someServers} from '../../../testing/data'

describe('DeploymentsSearchForm', () => {
  let fixture: ComponentFixture<DeploymentsSearchForm>
  let updates: IDeploymentSearch[]
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement

  async function render() {
    fixture = TestBed.createComponent(DeploymentsSearchForm)
    fixture.componentRef.setInput('servers', someServers())
    fixture.componentRef.setInput('theSearch', structuredClone(INITIAL_DEPLOYMENTS_STATE.search))
    updates = []
    fixture.componentInstance.updateSearch.subscribe((s) => updates.push(structuredClone(s)))
    await fixture.whenStable()
  }

  async function choose(id: string, value: string) {
    const select = byCy(id) as HTMLSelectElement
    select.value = value
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('offers all servers with their nicknames', async () => {
    await render()
    expect(Array.from((byCy('server-select') as HTMLSelectElement).options).map((o) => o.textContent?.trim()))
      .toEqual(['All servers', 'testserver · Tester', 'staging · Company Staging'])
  })

  it('searches when a server or page size is chosen', async () => {
    await render()
    await choose('server-select', 'staging')
    expect(updates.at(-1)?.serverName).toBe('staging')
    await choose('page-size-select', (byCy('page-size-select') as HTMLSelectElement).options[1].value)
    expect(Number(updates.at(-1)?.pageSize)).toBe(25)
  })

  it('reloads once per click and asks for a reset without searching', async () => {
    await render()
    let resets = 0
    fixture.componentInstance.resetSearch.subscribe(() => resets++)
    byCy('search-reset').click()
    expect(resets).toBe(1)
    expect(updates).toHaveLength(0)
    byCy('search-reload').click()
    expect(updates).toHaveLength(1)
  })
})

import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ServerList} from './server.list'
import {someServers} from '../../../testing/data'
import {IServer} from '../../core'

describe('ServerList', () => {
  let fixture: ComponentFixture<ServerList>
  const byTestId = (id: string, root: ParentNode = fixture.nativeElement) => root.querySelector(`[data-testid="${id}"]`) as HTMLElement
  const text = (el: HTMLElement) => el.textContent?.replace(/\s+/g, ' ').trim()

  async function render(servers: IServer[], selectedId: number | null = null) {
    fixture = TestBed.createComponent(ServerList)
    fixture.componentRef.setInput('servers', servers)
    fixture.componentRef.setInput('selectedId', selectedId)
    await fixture.whenStable()
  }

  it('shows name, nickname and description of each server', async () => {
    await render([...someServers(), {id: 3, name: 'bare'}])
    expect(text(byTestId('servers-count'))).toBe('3 servers')
    const testserver = byTestId('server-testserver')
    expect(text(byTestId('server-name', testserver))).toBe('testserver · Tester')
    expect(text(byTestId('server-description-text', testserver))).toBe('Main Testing Server')
    expect(text(byTestId('server-name', byTestId('server-bare')))).toBe('bare')
    expect(text(byTestId('server-description-text', byTestId('server-bare')))).toBe('No description')
  })

  it('marks the server being edited', async () => {
    await render(someServers(), 2)
    expect(byTestId('server-staging').getAttribute('aria-current')).toBe('true')
    expect(byTestId('server-testserver').getAttribute('aria-current')).toBeNull()
  })

  it('reports which server to edit', async () => {
    await render(someServers())
    const edited: IServer[] = []
    fixture.componentInstance.editServer.subscribe((s) => edited.push(s))
    byTestId('server-edit', byTestId('server-staging')).click()
    expect(edited).toEqual([someServers()[1]])
  })

  it('says so when there are no servers', async () => {
    await render([])
    expect(text(byTestId('servers-count'))).toBe('0 servers')
    expect(byTestId('servers-none')).toBeTruthy()
  })
})

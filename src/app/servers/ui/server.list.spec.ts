import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ServerList} from './server.list'
import {someServers} from '../../../testing/data'
import {IServer} from '../../core'

describe('ServerList', () => {
  let fixture: ComponentFixture<ServerList>
  const byCy = (id: string, root: ParentNode = fixture.nativeElement) => root.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
  const text = (el: HTMLElement) => el.textContent?.replace(/\s+/g, ' ').trim()

  async function render(servers: IServer[], selectedId: number | null = null) {
    fixture = TestBed.createComponent(ServerList)
    fixture.componentRef.setInput('servers', servers)
    fixture.componentRef.setInput('selectedId', selectedId)
    await fixture.whenStable()
  }

  it('shows name, nickname and description of each server', async () => {
    await render([...someServers(), {id: 3, name: 'bare'}])
    expect(text(byCy('servers-count'))).toBe('3 servers')
    const testserver = byCy('server-testserver')
    expect(text(byCy('server-name', testserver))).toBe('testserver · Tester')
    expect(text(byCy('server-description-text', testserver))).toBe('Main Testing Server')
    expect(text(byCy('server-name', byCy('server-bare')))).toBe('bare')
    expect(text(byCy('server-description-text', byCy('server-bare')))).toBe('No description')
  })

  it('marks the server being edited', async () => {
    await render(someServers(), 2)
    expect(byCy('server-staging').getAttribute('aria-current')).toBe('true')
    expect(byCy('server-testserver').getAttribute('aria-current')).toBeNull()
  })

  it('reports which server to edit', async () => {
    await render(someServers())
    const edited: IServer[] = []
    fixture.componentInstance.editServer.subscribe((s) => edited.push(s))
    byCy('server-edit', byCy('server-staging')).click()
    expect(edited).toEqual([someServers()[1]])
  })

  it('says so when there are no servers', async () => {
    await render([])
    expect(text(byCy('servers-count'))).toBe('0 servers')
    expect(byCy('servers-none')).toBeTruthy()
  })
})

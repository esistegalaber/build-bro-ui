import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {StatCards} from './stat-cards'
import {RecentDeployments} from './recent-deployments'
import {HomeBuildSets} from './home-build-sets'
import {build, someServers} from '../../../testing/data'
import {inTimeZone} from '../../../testing/timezone'
import {IDeployment} from '../../core'

const byCy = (el: HTMLElement, id: string) => el.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
const text = (el: HTMLElement | null) => el?.textContent?.replace(/\s+/g, ' ').trim()

describe('StatCards', () => {
  it('shows projects, branches, builds and labels', async () => {
    const fixture = TestBed.createComponent(StatCards)
    fixture.componentRef.setInput('stats', {numberOfProjects: 4, numberOfBranches: 14, numberOfBuilds: 90, numberOfLabels: 273, numberOfDeploys: 0})
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    const card = (key: string) => [
      byCy(el, `stat-${key}`).querySelector('.font-display')?.textContent?.trim(),
      byCy(el, `stat-${key}`).querySelector('.font-display + div')?.textContent?.trim()
    ]
    expect(card('projects')).toEqual(['4', 'Projects'])
    expect(card('branches')).toEqual(['14', 'Branches'])
    expect(card('builds')).toEqual(['90', 'Builds'])
    expect(card('labels')).toEqual(['273', 'Labels'])
  })
})

describe('RecentDeployments', () => {
  const deployment = (id: number, serverName: string, builds: number): IDeployment => ({
    id, serverName, deployedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), labels: [],
    builds: Array.from({length: builds}, (_, i) => build(100 + i, `service-${i + 1}`, 'main', i + 1))
  })

  async function render(deployments: IDeployment[] | null) {
    TestBed.configureTestingModule({providers: [provideRouter([])]})
    const fixture = TestBed.createComponent(RecentDeployments)
    fixture.componentRef.setInput('deployments', deployments)
    fixture.componentRef.setInput('servers', someServers())
    await fixture.whenStable()
    return fixture.nativeElement as HTMLElement
  }

  it('shows server, nickname, how long ago and the builds', async () => {
    const el = await render([deployment(1, 'testserver', 2)])
    const row = text(byCy(el, 'home-deployment-1'))
    expect(row).toContain('testserver · Tester')
    expect(row).toContain('2 days ago')
    expect(row).toContain('service-1 #1')
    expect(row).toContain('service-2 #2')
    expect(row).toContain('service-1 #1, service-2 #2')
    expect(byCy(el, 'home-deployment-1').querySelector('.badge')).toBeNull()
    expect(byCy(el, 'home-deployment-more')).toBeNull()
  })

  describe('in Europe/Berlin', () => {
    inTimeZone('Europe/Berlin')

    it('shows the exact time, which the API sends in UTC, in the browser\'s timezone', async () => {
      const el = await render([{...deployment(1, 'testserver', 1), deployedAt: '2026-11-22T19:42:48Z'}])
      expect(byCy(el, 'home-deployment-1').querySelector('[title]')?.getAttribute('title')).toBe('Nov 22, 2026, 8:42:48 PM')
    })
  })

  it('summarizes the builds of a deployment with many of them', async () => {
    const el = await render([deployment(1, 'staging', 20)])
    expect(byCy(el, 'home-deployment-1').querySelectorAll('.font-mono')).toHaveLength(3)
    expect(text(byCy(el, 'home-deployment-more'))).toBe('+17 more')
    expect(text(byCy(el, 'home-deployment-1'))).toContain('service-3 #3, +17 more')
  })

  it('shows that it is loading', async () => {
    expect(text(await render(null))).toContain('Loading…')
  })

  it('shows an empty state', async () => {
    expect(text(byCy(await render([]), 'home-deployments-none'))).toBe('No deployments yet.')
  })
})

describe('HomeBuildSets', () => {
  async function render(buildSets: { name: string, projects: number, pinned: number }[] | null) {
    TestBed.configureTestingModule({providers: [provideRouter([])]})
    const fixture = TestBed.createComponent(HomeBuildSets)
    fixture.componentRef.setInput('buildSets', buildSets)
    await fixture.whenStable()
    return fixture.nativeElement as HTMLElement
  }

  it('lists the build sets with a summary and a link to each', async () => {
    const el = await render([{name: 'main', projects: 2, pinned: 1}, {name: 'Environment of StageServer', projects: 0, pinned: 0}])
    expect(text(byCy(el, 'home-build-set-main'))).toContain('2 projects · 1 pinned')
    expect(byCy(el, 'home-build-set-main').getAttribute('href')).toBe('/edit-build-set/main')
    expect(text(byCy(el, 'home-build-set-Environment of StageServer'))).toContain('No projects yet')
    expect(byCy(el, 'home-new-build-set').getAttribute('href')).toBe('/edit-build-set')
  })

  it('shows that it is loading', async () => {
    expect(text(await render(null))).toContain('Loading…')
  })

  it('shows an empty state', async () => {
    expect(text(byCy(await render([]), 'home-build-sets-none'))).toBe('No build sets yet.')
  })
})

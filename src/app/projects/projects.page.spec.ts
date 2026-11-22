import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {ProjectsPage} from './projects.page'
import {includeInactiveData, projectsData} from '../core/state/projects/project.selectors'
import * as CoreActions from '../core/actions'
import {someProjects} from '../../testing/data'
import {IProject} from '../core'

describe('ProjectsPage', () => {
  async function render(projects: IProject[] = someProjects()) {
    TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [provideMockStore({
        selectors: [{selector: projectsData, value: projects}, {selector: includeInactiveData, value: false}]
      })]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(ProjectsPage)
    await fixture.whenStable()
    const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T
    // rows only: branch-2, project-backend (the switches inside a row are branch-activate/-deactivate)
    const all = (prefix: string) => [...fixture.nativeElement.querySelectorAll(`[data-cy-id^="${prefix}"]`)]
      .filter((el: Element) => prefix !== 'branch-' || /^branch-\d+$/.test(el.getAttribute('data-cy-id')!)).length
    const type = async (value: string) => {
      const search = byCy<HTMLInputElement>('projects-search')
      search.value = value
      search.dispatchEvent(new Event('input'))
      await fixture.whenStable()
    }
    return {fixture, dispatched, byCy, all, type}
  }

  it('shows a card per project', async () => {
    const {byCy, all} = await render()
    expect(byCy('projects-count').textContent?.trim()).toBe('3 projects')
    expect(all('project-backend')).toBe(1)
    expect(all('branch-')).toBe(5)
  })

  it('searches projects and branches, and clears the search', async () => {
    const {fixture, byCy, all, type} = await render()
    await type('next')
    expect(byCy('projects-count').textContent?.trim()).toBe('1 project')
    expect(all('branch-')).toBe(1)
    await type('nothing')
    expect(byCy('projects-empty').textContent).toContain('nothing')
    byCy('projects-search-clear').click()
    await fixture.whenStable()
    expect(all('branch-')).toBe(5)
  })

  it('says so when there are no projects', async () => {
    const {byCy} = await render([])
    expect(byCy('projects-none')).toBeTruthy()
  })

  it('switches branches', async () => {
    const {dispatched, byCy} = await render()
    ;(byCy('branch-2').querySelector('[data-cy-id=branch-deactivate]') as HTMLElement).click()
    ;(byCy('branch-3').querySelector('[data-cy-id=branch-activate]') as HTMLElement).click()
    expect(dispatched.mock.calls).toEqual([
      [CoreActions.deactivateBranch({branchId: 2})],
      [CoreActions.activateBranch({branchId: 3})]
    ])
  })

  it('toggles the inactive projects', async () => {
    const {dispatched, byCy} = await render()
    const toggle = byCy<HTMLInputElement>('inactive-toggle')
    toggle.click()
    expect(dispatched).toHaveBeenCalledWith(CoreActions.toggleInactiveData())
    expect(toggle.checked).toBe(false)
  })
})

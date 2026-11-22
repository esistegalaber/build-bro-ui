import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildTemplateList} from './build-template.list'
import {EditableBuildTemplate, IProject} from '../../core'
import {branch, project} from '../../../testing/data'

describe('BuildTemplateList', () => {
  const names = ['api-gateway', 'auth', 'billing', 'catalog', 'checkout']
  const templates = (): EditableBuildTemplate[] => names.map((name, i) => ({
    project: project(i + 1, name, [branch(i + 1, 'main', i + 1)]),
    projectSelected: i < 3,
    branch: i < 3 ? branch(i + 1, 'main', i + 1) : null,
    buildNumber: null,
    labels: {}
  }))
  let fixture: ComponentFixture<BuildTemplateList>
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
  const shownProjects = () => Array.from(fixture.nativeElement.querySelectorAll('[data-cy-id^="build-template-"]'))
    .map((row) => (row as HTMLElement).getAttribute('data-cy-id')!.replace('build-template-', ''))

  async function render() {
    fixture = TestBed.createComponent(BuildTemplateList)
    fixture.componentRef.setInput('templates', templates())
    await fixture.whenStable()
  }

  it('lists all projects and counts the included ones', async () => {
    await render()
    expect(shownProjects()).toEqual(names)
    expect(byCy('projects-count').textContent?.trim()).toBe('3 of 5 included')
  })

  it('searches projects by name', async () => {
    await render()
    const search = byCy('project-search') as HTMLInputElement
    search.value = 'C'
    search.dispatchEvent(new Event('input'))
    await fixture.whenStable()
    expect(shownProjects()).toEqual(['catalog', 'checkout'])
  })

  it('shows only the included or only the excluded projects', async () => {
    await render()
    byCy('show-included').click()
    await fixture.whenStable()
    expect(shownProjects()).toEqual(['api-gateway', 'auth', 'billing'])
    expect(byCy('show-included').getAttribute('aria-pressed')).toBe('true')
    byCy('show-excluded').click()
    await fixture.whenStable()
    expect(shownProjects()).toEqual(['catalog', 'checkout'])
    byCy('show-all').click()
    await fixture.whenStable()
    expect(shownProjects()).toHaveLength(5)
  })

  it('says so when nothing matches', async () => {
    await render()
    const search = byCy('project-search') as HTMLInputElement
    search.value = 'nothing like this'
    search.dispatchEvent(new Event('input'))
    await fixture.whenStable()
    expect(byCy('projects-none').textContent).toContain('No project matches.')
  })

  it('passes the row events on', async () => {
    await render()
    const added: IProject[] = []
    fixture.componentInstance.projectAdded.subscribe((p) => added.push(p))
    ;(byCy('build-template-catalog').querySelector('[data-cy-id=project-toggle]') as HTMLInputElement).click()
    expect(added.map((p) => p.name)).toEqual(['catalog'])
  })
})

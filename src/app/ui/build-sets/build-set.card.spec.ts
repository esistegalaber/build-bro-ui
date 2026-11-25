import {ComponentFixture, TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {BuildSetCard} from './build-set.card'
import {IBuildSet} from '../../core'
import {build} from '../../../testing/data'

describe('BuildSetCard', () => {
  let fixture: ComponentFixture<BuildSetCard>
  const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement

  async function render(buildSet: IBuildSet, summary = {name: buildSet.name, projects: 2, pinned: 1}) {
    TestBed.configureTestingModule({providers: [provideRouter([])]})
    fixture = TestBed.createComponent(BuildSetCard)
    fixture.componentRef.setInput('buildSet', buildSet)
    fixture.componentRef.setInput('summary', summary)
    await fixture.whenStable()
  }

  it('shows the build set, its summary and its builds', async () => {
    await render({name: 'main', builds: {backend: build(9, 'backend', 'main', 9), frontend: build(40, 'frontend', 'main', 10)}})
    expect(byTestId('build-set-card').querySelector('h2')?.textContent?.trim()).toBe('Builds of main')
    expect(byTestId('build-set-card').textContent?.replace(/\s+/g, ' ')).toContain('2 projects, 1 pinned to a build number')
    expect(byTestId('build-9')).toBeTruthy()
    expect(byTestId('build-40')).toBeTruthy()
    expect(byTestId('build-set-empty')).toBeNull()
  })

  it('links to edit and clone, with the name encoded', async () => {
    await render({name: 'Environment of StageServer', builds: {}})
    expect(byTestId('build-set-edit').getAttribute('href')).toBe('/edit-build-set/Environment%20of%20StageServer')
    expect(byTestId('build-set-clone').getAttribute('href')).toBe('/edit-build-set/clone/Environment%20of%20StageServer')
  })

  it('shows an empty state without builds', async () => {
    await render({name: 'feature-test-stage-1', builds: {}}, {name: 'feature-test-stage-1', projects: 0, pinned: 0})
    expect(byTestId('build-set-empty').textContent).toContain('no builds yet')
    expect(byTestId('build-set-card').textContent).toContain('No projects yet')
  })

  it('asks to delete the build set', async () => {
    const buildSet = {name: 'main', builds: {}}
    await render(buildSet)
    const asked: IBuildSet[] = []
    fixture.componentInstance.deleteBuildSet.subscribe((b) => asked.push(b))
    byTestId('build-set-delete').click()
    expect(asked).toEqual([buildSet])
  })
})

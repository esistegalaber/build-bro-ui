import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ResolvedBuildsPanel} from './resolved-builds.panel'
import {EditableBuildTemplate, IBuild} from '../../core'
import {branch, project} from '../../../testing/data'

describe('ResolvedBuildsPanel', () => {
  let fixture: ComponentFixture<ResolvedBuildsPanel>
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement

  function template(id: number, name: string, selected: boolean, branchName: string | null, buildNumber: number | null = null): EditableBuildTemplate {
    return {
      project: project(id, name, [branch(id, 'main', id)]), projectSelected: selected,
      branch: branchName ? branch(id, branchName, id) : null, buildNumber, labels: {}
    }
  }

  async function render(templates: EditableBuildTemplate[], builds: IBuild[]) {
    fixture = TestBed.createComponent(ResolvedBuildsPanel)
    fixture.componentRef.setInput('templates', templates)
    fixture.componentRef.setInput('builds', builds)
    await fixture.whenStable()
  }

  it('shows the build each included project resolves to, with pins but no test status', async () => {
    await render(
      [template(1, 'backend', true, 'main', 9), template(2, 'frontend', true, 'main')],
      [
        {id: 9, project: 'backend', branch: 'main', buildNumber: 9, labels: [{id: 1, key: 'integration-test', value: 'ok'}]},
        {id: 40, project: 'frontend', branch: 'main', buildNumber: 10, labels: []}
      ])
    expect(byCy('build-9').textContent?.trim()).toBe('#9')
    expect(byCy('resolved-backend').textContent).toContain('pinned')
    expect(byCy('resolved-backend').textContent).not.toContain('tests ok')
    expect(byCy('build-40').textContent?.trim()).toBe('#10')
    expect(byCy('resolved-frontend').textContent).not.toContain('pinned')
  })

  it('leaves out projects that are switched off, even with an old build', async () => {
    await render([template(1, 'backend', false, null)], [{id: 9, project: 'backend', branch: 'main', buildNumber: 9, labels: []}])
    expect(byCy('resolved-backend')).toBeNull()
    expect(byCy('resolved-none').textContent).toContain('Switch on a project')
  })

  it('says when an included project has no branch yet or no matching build', async () => {
    await render([template(1, 'backend', true, null), template(2, 'frontend', true, 'main', 99)], [])
    expect(byCy('resolved-backend').querySelector('[data-cy-id=resolved-no-branch]')).toBeTruthy()
    expect(byCy('resolved-frontend').querySelector('[data-cy-id=resolved-missing]')?.textContent?.trim()).toBe('no matching build')
  })
})

import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BranchSwitch, ProjectCard} from './project.card'
import {branch, project, someProjects} from '../../../testing/data'
import {IProject} from '../../core'

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>
  const byTestId = <T extends HTMLElement = HTMLElement>(id: string, root: ParentNode = fixture.nativeElement) =>
    root.querySelector(`[data-testid="${id}"]`) as T
  const text = (el: HTMLElement) => el.textContent?.replace(/\s+/g, ' ').trim()

  async function render(theProject: IProject) {
    fixture = TestBed.createComponent(ProjectCard)
    fixture.componentRef.setInput('project', theProject)
    await fixture.whenStable()
  }

  it('shows the project with its branches and tells inactive ones apart by text', async () => {
    await render(someProjects()[0])
    expect(text(byTestId('project-summary'))).toBe('3 branches · 1 inactive')
    expect(byTestId('project-inactive')).toBeNull()
    expect(text(byTestId('branch-name', byTestId('branch-2')))).toBe('next')
    expect(byTestId('branch-inactive', byTestId('branch-2'))).toBeNull()
    expect(text(byTestId('branch-inactive', byTestId('branch-3')))).toBe('Inactive')
    const on = byTestId<HTMLInputElement>('branch-deactivate', byTestId('branch-2'))
    expect(on.checked).toBe(true)
    expect(on.getAttribute('aria-label')).toBe('Branch next of backend is active')
    expect(byTestId<HTMLInputElement>('branch-activate', byTestId('branch-3')).checked).toBe(false)
  })

  it('marks an inactive project', async () => {
    await render(someProjects()[2])
    expect(text(byTestId('project-summary'))).toBe('1 branch')
    expect(text(byTestId('project-inactive'))).toContain('Inactive')
  })

  it('says so when no branch is shown', async () => {
    await render(project(9, 'empty', []))
    expect(text(byTestId('project-summary'))).toBe('0 branches')
    expect(byTestId('project-no-branches')).toBeTruthy()
  })

  it.each([
    {active: true, id: 'branch-deactivate', expected: false},
    {active: false, id: 'branch-activate', expected: true}
  ])('asks to switch a branch with active=$active and keeps the switch until the store answers', async ({active, id, expected}) => {
    await render(project(1, 'backend', [branch(7, 'next', 1, active)]))
    const switched: BranchSwitch[] = []
    fixture.componentInstance.switchBranch.subscribe((s) => switched.push(s))
    const toggle = byTestId<HTMLInputElement>(id)
    toggle.click()
    expect(switched).toEqual([{branchId: 7, active: expected}])
    expect(toggle.checked).toBe(active)
  })
})

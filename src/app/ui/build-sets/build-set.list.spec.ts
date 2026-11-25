import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildSetList} from './build-set.list'

describe('BuildSetList', () => {
  let fixture: ComponentFixture<BuildSetList>
  const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
  const text = (id: string) => byTestId(id).textContent?.replace(/\s+/g, ' ').trim()

  async function render(selectedName: string | null = null) {
    fixture = TestBed.createComponent(BuildSetList)
    fixture.componentRef.setInput('summaries', [
      {name: 'main', projects: 2, pinned: 1},
      {name: 'single', projects: 1, pinned: 0},
      {name: 'feature-test-stage-1', projects: 0, pinned: 0}
    ])
    fixture.componentRef.setInput('selectedName', selectedName)
    await fixture.whenStable()
  }

  it('summarizes each build set', async () => {
    await render()
    expect(text('build-set-name-main')).toBe('main 2 projects · 1 pinned')
    expect(text('build-set-name-single')).toBe('single 1 project')
    expect(text('build-set-name-feature-test-stage-1')).toBe('feature-test-stage-1 No projects yet')
  })

  it('marks the selected build set', async () => {
    await render('main')
    expect(byTestId('build-set-name-main').classList).toContain('menu-active')
    expect(byTestId('build-set-name-main').getAttribute('aria-current')).toBe('true')
    expect(byTestId('build-set-name-single').classList).not.toContain('menu-active')
  })

  it('reports the chosen build set', async () => {
    await render()
    const chosen: string[] = []
    fixture.componentInstance.buildSetSelected.subscribe((name) => chosen.push(name))
    byTestId('build-set-name-single').click()
    expect(chosen).toEqual(['single'])
  })

  it('says so when there are no build sets', async () => {
    fixture = TestBed.createComponent(BuildSetList)
    fixture.componentRef.setInput('summaries', [])
    await fixture.whenStable()
    expect(byTestId('build-sets-none').textContent).toContain('No build sets yet.')
  })
})

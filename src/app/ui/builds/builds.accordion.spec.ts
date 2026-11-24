import {TestBed} from '@angular/core/testing'
import {BuildsAccordion} from './builds.accordion'
import {summarizeBuild} from './build-summary.pipe'
import {IBuild, ILabelDefinition} from '../../core'
import {someLabelDefinitions} from '../../../testing/data'

function buildWith(id: number, labels: [string, string][]): IBuild {
  return {
    id, project: 'backend', branch: 'main', buildNumber: id,
    labels: labels.map(([key, value], i) => ({id: id * 10 + i, key, value}))
  }
}

describe('summarizeBuild', () => {
  it('takes the test status and a short revision from the labels', () => {
    expect(summarizeBuild(buildWith(1, [['integration-test', 'ok'], ['revision', 'e6859b79b73630f6250f569a']])))
      .toEqual({testStatus: 'ok', revision: 'e6859b79b736'})
  })

  it('has nothing to show for a build without those labels', () => {
    expect(summarizeBuild(buildWith(1, [['release.name', 'Analog-Amoeba']]))).toEqual({testStatus: null, revision: null})
  })
})

describe('BuildsAccordion', () => {
  async function render(builds: IBuild[], labelDefinitions: ILabelDefinition[] = []) {
    const fixture = TestBed.createComponent(BuildsAccordion)
    fixture.componentRef.setInput('builds', builds)
    fixture.componentRef.setInput('labelDefinitions', labelDefinitions)
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    return {el, rows: () => Array.from(el.querySelectorAll('[data-cy-id=build-row]')) as HTMLElement[]}
  }

  it('shows one row per build with project, branch and build number', async () => {
    const {el, rows} = await render([buildWith(9, []), buildWith(10, [])])
    expect(rows()).toHaveLength(2)
    expect(el.querySelector('[data-cy-id=build-9]')).toBeTruthy()
    expect(rows()[1].querySelector('.collapse-title')?.textContent?.replace(/\s+/g, ' ')).toContain('backend')
    expect(rows()[1].textContent).toContain('main')
    expect(rows()[1].textContent).toContain('#10')
  })

  it('shows no test status badge in the row; the status is among the labels', async () => {
    const {rows} = await render([buildWith(1, [['integration-test', 'ok']])])
    expect(rows()[0].querySelector('.collapse-title .badge')).toBeNull()
    expect(rows()[0].querySelector('.collapse-title')?.textContent).not.toContain('tests ok')
    expect(rows()[0].querySelector('.collapse-content')?.textContent).toContain('integration-test')
  })

  it('lists the build id and all labels, sorted by key, in the expandable part', async () => {
    const {rows} = await render([buildWith(10, [['integration-test', 'broken'], ['revision', 'abc'], ['jenkins-build', 'http://j/1']])])
    const keys = Array.from(rows()[0].querySelectorAll('dt')).map((dt) => dt.textContent?.trim())
    expect(keys).toEqual(['Build Bruh ID', 'revision', 'jenkins-build', 'integration-test'])
    expect(rows()[0].querySelector('dd')?.textContent?.trim()).toBe('10')
  })

  it('labels the expand checkbox for screen readers', async () => {
    const {el} = await render([buildWith(10, [])])
    expect(el.querySelector('[data-cy-id=build-10]')?.getAttribute('aria-label')).toBe('Show the labels of backend main #10')
  })

  it('shows defined labels by display name, with their style and type', async () => {
    const {rows} = await render([buildWith(10, [['integration-test', 'broken'], ['jenkins-build', 'http://j/1'], ['part-of-build-set', 'main']])],
      someLabelDefinitions())
    const terms = Array.from(rows()[0].querySelectorAll('dt'))
    expect(terms.map((dt) => dt.textContent?.trim())).toEqual(['Build Bruh ID', 'part-of-build-set', 'Jenkins build', 'Integration test'])
    expect(terms[3].getAttribute('title')).toBe('integration-test')
    expect(terms[1].getAttribute('title')).toBeNull()
    const chips = Array.from(rows()[0].querySelectorAll('dd [data-cy-id=label-chip]')) as HTMLElement[]
    expect(chips[0].className).toBe('')
    expect(chips[1].querySelector('[data-cy-id=label-link]')?.getAttribute('href')).toBe('http://j/1')
    expect(chips[2].classList).toContain('badge-error')
  })
})

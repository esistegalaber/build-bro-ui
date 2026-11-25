import {TestBed} from '@angular/core/testing'
import {LabelViolationsTable} from './label-violations.table'
import {ILabelViolation} from '../../core'

describe('LabelViolationsTable', () => {
  async function render(violations: ILabelViolation[], showKey = true) {
    const fixture = TestBed.createComponent(LabelViolationsTable)
    fixture.componentRef.setInput('violations', violations)
    fixture.componentRef.setInput('showKey', showKey)
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    const cells = (row: number) => Array.from(el.querySelectorAll('[data-testid=label-violation]')[row].querySelectorAll('td'))
      .map((td) => td.textContent?.trim())
    return {el, cells}
  }

  it('lists wrong values and labels on the wrong entity', async () => {
    const {cells} = await render([
      {key: 'qa', value: 'pass', target: 'BUILD', reason: 'INVALID_VALUE', count: 3},
      {key: 'revision', value: null, target: 'DEPLOYMENT', reason: 'WRONG_TARGET', count: 1}
    ])
    expect(cells(0)).toEqual(['qa', 'pass', 'builds', 'value not allowed', '3'])
    expect(cells(1)).toEqual(['revision', '–', 'deployments', 'not meant for deployments', '1'])
  })

  it('leaves out the key where all rows have the same', async () => {
    const {el, cells} = await render([{key: 'qa', value: 'pass', target: 'BUILD', reason: 'INVALID_VALUE', count: 3}], false)
    expect(cells(0)).toEqual(['pass', 'builds', 'value not allowed', '3'])
    expect(el.querySelectorAll('th')).toHaveLength(4)
  })

  it('says so when everything fits', async () => {
    const {el} = await render([])
    expect(el.querySelector('[data-testid=label-violations-none]')?.textContent).toContain('All stored labels fit')
  })
})

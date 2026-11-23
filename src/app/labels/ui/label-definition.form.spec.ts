import {ComponentFixture, TestBed} from '@angular/core/testing'
import {LabelDefinitionDraft, LabelDefinitionForm} from './label-definition.form'
import {ILabelDefinition} from '../../core'
import {LabelReport} from '../state/labels-admin.reducer'
import {deepFreeze} from '../../../testing/freeze'
import {someLabelDefinitions} from '../../../testing/data'

describe('LabelDefinitionForm', () => {
  let fixture: ComponentFixture<LabelDefinitionForm>
  let previews: LabelDefinitionDraft[]
  let saves: LabelDefinitionDraft[]
  let cancels: number
  const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T

  async function render(definition: ILabelDefinition | null, report: LabelReport | null = null) {
    fixture = TestBed.createComponent(LabelDefinitionForm)
    fixture.componentRef.setInput('definition', definition ? deepFreeze(structuredClone(definition)) : null)
    fixture.componentRef.setInput('report', report)
    previews = []
    saves = []
    cancels = 0
    fixture.componentInstance.previewDefinition.subscribe((d) => previews.push(d))
    fixture.componentInstance.saveDefinition.subscribe((d) => saves.push(d))
    fixture.componentInstance.cancel.subscribe(() => cancels++)
    await fixture.whenStable()
  }

  async function type(id: string, value: string) {
    const field = byCy<HTMLInputElement | HTMLTextAreaElement>(id)
    field.value = value
    field.dispatchEvent(new Event('input'))
    await fixture.whenStable()
  }

  async function choose(id: string, value: string) {
    const select = byCy<HTMLSelectElement>(id)
    select.value = value
    select.dispatchEvent(new Event('input'))
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('starts a new definition with a key, for builds and deployments, and saves only with a key', async () => {
    await render(null)
    expect(byCy('label-key')).toBeTruthy()
    expect(byCy<HTMLButtonElement>('label-save').disabled).toBe(true)
    await type('label-key', ' qa ')
    expect(byCy<HTMLButtonElement>('label-save').disabled).toBe(false)
    byCy<HTMLButtonElement>('label-save').click()
    await fixture.whenStable()
    expect(saves).toEqual([{
      key: 'qa',
      definition: {
        key: 'qa', displayName: undefined, description: undefined, appliesTo: ['BUILD', 'DEPLOYMENT'], type: 'STRING',
        allowedValues: [], pattern: undefined, style: undefined, valueStyles: {}
      }
    }])
  })

  it('edits an enum: its values, a style per value, and sends only what belongs to the type', async () => {
    await render(someLabelDefinitions()[0])
    expect(byCy('label-key')).toBeNull()
    expect(byCy<HTMLTextAreaElement>('label-allowed-values').value).toBe('ok\nbroken')
    expect(byCy<HTMLSelectElement>('label-value-style-broken').value).toBe('ERROR')
    await type('label-allowed-values', 'ok\n flaky \n\nbroken')
    await choose('label-value-style-flaky', 'WARNING')
    await choose('label-value-style-ok', '')
    byCy<HTMLButtonElement>('label-preview').click()
    expect(previews).toEqual([{
      key: 'integration-test',
      definition: expect.objectContaining({
        type: 'ENUM', appliesTo: ['BUILD'], allowedValues: ['ok', 'flaky', 'broken'],
        displayName: 'Integration test', valueStyles: {broken: 'ERROR', flaky: 'WARNING'}
      })
    }])
  })

  it('shows the pattern for REGEX and drops enum values and value styles of another type', async () => {
    await render(someLabelDefinitions()[0])
    await choose('label-type', 'REGEX')
    expect(byCy('label-allowed-values')).toBeNull()
    expect(byCy('label-value-styles')).toBeNull()
    await type('label-pattern', '[a-z]+')
    await choose('label-style', 'INFO')
    byCy<HTMLButtonElement>('label-preview').click()
    expect(previews[0].definition).toEqual(expect.objectContaining({
      type: 'REGEX', pattern: '[a-z]+', allowedValues: [], valueStyles: {}, style: 'INFO'
    }))
  })

  it('offers a style for true and false of a boolean', async () => {
    await render(null)
    await choose('label-type', 'BOOLEAN')
    expect(byCy('label-value-style-true')).toBeTruthy()
    expect(byCy('label-value-style-false')).toBeTruthy()
  })

  it('takes the entities from the checkboxes', async () => {
    await render(someLabelDefinitions()[1])
    const deployments = byCy<HTMLInputElement>('label-applies-deployment')
    deployments.checked = true
    deployments.dispatchEvent(new Event('input'))
    deployments.dispatchEvent(new Event('change'))
    await fixture.whenStable()
    byCy<HTMLButtonElement>('label-preview').click()
    expect(previews[0].definition.appliesTo).toEqual(['BUILD', 'DEPLOYMENT'])
  })

  it('shows the report about its key: preview or saved, with the values that don’t fit', async () => {
    const violations = [{key: 'integration-test', value: 'broken', target: 'BUILD' as const, reason: 'INVALID_VALUE' as const, count: 45}]
    await render(someLabelDefinitions()[0], {change: {definition: someLabelDefinitions()[0], violations}, saved: false})
    expect(byCy('label-report').textContent).toContain('1 value doesn’t fit this definition')
    expect(byCy('label-report').querySelectorAll('[data-cy-id=label-violation]')).toHaveLength(1)

    fixture.componentRef.setInput('report', {change: {definition: someLabelDefinitions()[0], violations: []}, saved: true})
    await fixture.whenStable()
    expect(byCy('label-report').textContent?.replace(/\s+/g, ' ')).toContain('Saved. All stored labels with this key fit.')
  })

  it('hides a report about another key', async () => {
    await render(someLabelDefinitions()[1], {change: {definition: someLabelDefinitions()[0], violations: []}, saved: true})
    expect(byCy('label-report')).toBeNull()
  })

  it('cancels with the button or Escape', async () => {
    await render(null)
    byCy<HTMLButtonElement>('label-cancel').click()
    byCy('label-definition-form').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))
    expect(cancels).toBe(2)
  })
})

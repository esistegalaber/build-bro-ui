import {TestBed} from '@angular/core/testing'
import {LabelDefinitionList} from './label-definition.list'
import {ILabelDefinition} from '../../core'
import {aBooleanDefinition, someLabelDefinitions} from '../../../testing/data'

describe('LabelDefinitionList', () => {
  async function render(definitions: ILabelDefinition[], selectedKey: string | null = null) {
    const fixture = TestBed.createComponent(LabelDefinitionList)
    fixture.componentRef.setInput('definitions', definitions)
    fixture.componentRef.setInput('selectedKey', selectedKey)
    const edited: ILabelDefinition[] = []
    const deleted: ILabelDefinition[] = []
    fixture.componentInstance.editDefinition.subscribe((d) => edited.push(d))
    fixture.componentInstance.deleteDefinition.subscribe((d) => deleted.push(d))
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    const rows = () => Array.from(el.querySelectorAll('[data-testid=label-definition]')) as HTMLElement[]
    return {el, rows, edited, deleted}
  }

  it('shows name, key, type and entities, and marks the selected one', async () => {
    const {rows} = await render([...someLabelDefinitions(), aBooleanDefinition()], 'jenkins-build')
    const text = (row: HTMLElement) => row.textContent?.replace(/\s+/g, ' ')
    expect(rows()[0].querySelector('.font-semibold')?.textContent).toBe('Integration test')
    expect(text(rows()[0])).toContain('integration-test · One of a list · builds')
    expect(rows()[3].querySelector('.font-semibold')?.textContent).toBe('released')
    expect(text(rows()[3])).toContain('released · Boolean · builds and deployments')
    expect(rows()[1].classList).toContain('bg-base-200')
    expect(rows()[0].classList).not.toContain('bg-base-200')
  })

  it('previews the values of enums and booleans with their styles, and the style of the others', async () => {
    const {rows} = await render([...someLabelDefinitions(), aBooleanDefinition()])
    const chips = (row: HTMLElement) => Array.from(row.querySelectorAll('[data-testid=label-chip]')) as HTMLElement[]
    expect(chips(rows()[0]).map((c) => c.textContent?.trim())).toEqual(['ok', 'broken'])
    expect(chips(rows()[0])[1].classList).toContain('badge-error')
    expect(chips(rows()[3])).toHaveLength(2)
    expect(rows()[1].querySelector('.badge-info')?.textContent?.trim()).toBe('info')
    expect(chips(rows()[2])).toHaveLength(0)
  })

  it('asks to edit or delete a definition', async () => {
    const {rows, edited, deleted} = await render(someLabelDefinitions())
    ;(rows()[1].querySelector('[data-testid=label-definition-edit]') as HTMLButtonElement).click()
    ;(rows()[2].querySelector('[data-testid=label-definition-delete]') as HTMLButtonElement).click()
    expect(edited.map((d) => d.key)).toEqual(['jenkins-build'])
    expect(deleted.map((d) => d.key)).toEqual(['revision'])
  })

  it('explains that labels are free-form without definitions', async () => {
    const {el} = await render([])
    expect(el.querySelector('[data-testid=label-definitions-none]')?.textContent).toContain('free-form')
  })
})

import {Component, input} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {LabelChip} from './label-chip'
import {ILabelDefinition} from '../../core'
import {aBooleanDefinition, someLabelDefinitions} from '../../../testing/data'

@Component({
  template: `
    <bb-label-chip [labelKey]="labelKey()" [value]="value()" [definition]="definition()" [mode]="mode()">
      <button type="button" data-cy-id="projected">x</button>
    </bb-label-chip>`,
  imports: [LabelChip]
})
class Host {
  readonly labelKey = input('integration-test')
  readonly value = input('ok')
  readonly definition = input<ILabelDefinition | undefined>(undefined)
  readonly mode = input<'chip' | 'value'>('chip')
}

describe('LabelChip', () => {
  const [integrationTest, jenkinsBuild, revision] = someLabelDefinitions()

  async function render(inputs: Partial<{ labelKey: string, value: string, definition: ILabelDefinition, mode: 'chip' | 'value' }>) {
    const fixture = TestBed.createComponent(Host)
    Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value))
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    const chip = el.querySelector('[data-cy-id=label-chip]') as HTMLElement
    // the projected button's "x" follows the value directly
    return {el, chip, text: () => chip.textContent?.replace(/\s+/g, ' ').trim()}
  }

  it('shows a label without a definition as before: "key = value" in a primary badge', async () => {
    const {chip, text} = await render({labelKey: 'part-of-build-set', value: 'main'})
    expect(text()).toBe('part-of-build-set = mainx')
    expect(chip.classList).toContain('badge-primary')
    expect(chip.getAttribute('title')).toBeNull()
  })

  it('shows a defined label by its display name and value style, with the key as tooltip', async () => {
    const {chip, text} = await render({value: 'broken', definition: integrationTest})
    expect(text()).toBe('Integration test = brokenx')
    expect(chip.classList).toContain('badge-error')
    expect(chip.getAttribute('title')).toContain('integration-test')
    expect(chip.getAttribute('data-label-style')).toBe('ERROR')
  })

  it('shows a defined label without a style as a neutral badge', async () => {
    const {chip} = await render({labelKey: 'revision', value: 'abc', definition: revision})
    expect(chip.classList).toContain('badge-neutral')
    expect(chip.querySelector('.font-mono')?.textContent).toBe('abc')
  })

  it('links a URL, opening a new tab without access to this one', async () => {
    const {chip} = await render({labelKey: 'jenkins-build', value: 'http://my-jenkins/1', definition: jenkinsBuild})
    const link = chip.querySelector('[data-cy-id=label-link]') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('http://my-jenkins/1')
    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noopener noreferrer')
  })

  it('shows a boolean with an icon', async () => {
    const {chip, text} = await render({labelKey: 'released', value: 'true', definition: aBooleanDefinition()})
    expect(chip.querySelector('.material-icons')?.textContent).toBe('check_circle')
    expect(text()).toContain('check_circle')
    expect(chip.classList).toContain('badge-success')
  })

  it('shows only the value in value mode, as a badge only when a style applies', async () => {
    const styled = await render({value: 'ok', definition: integrationTest, mode: 'value'})
    expect(styled.text()).toBe('okx')
    expect(styled.chip.classList).toContain('badge-success')

    TestBed.resetTestingModule()
    const plain = await render({labelKey: 'part-of-build-set', value: 'main', mode: 'value'})
    expect(plain.text()).toBe('mainx')
    expect(plain.chip.className).toBe('')
  })
})

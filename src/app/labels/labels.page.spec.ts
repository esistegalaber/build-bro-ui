import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {LabelsPage} from './labels.page'
import {ILabelSettings, ILabelViolation, theLabelDefinitions} from '../core'
import {theLabelReport, theLabelSettings, theLabelViolations} from './state/labels-admin.selectors'
import * as LabelAdminActions from './state/labels-admin.actions'
import {someLabelDefinitions} from '../../testing/data'

describe('LabelsPage', () => {
  const violation: ILabelViolation = {key: 'integration-test', value: 'flaky', target: 'BUILD', reason: 'INVALID_VALUE', count: 2}

  async function render(settings: ILabelSettings | null = {labelValidation: 'OFF'}, violations: ILabelViolation[] = []) {
    TestBed.configureTestingModule({
      imports: [LabelsPage],
      providers: [provideMockStore({
        selectors: [
          {selector: theLabelDefinitions, value: someLabelDefinitions()},
          {selector: theLabelViolations, value: violations},
          {selector: theLabelSettings, value: settings},
          {selector: theLabelReport, value: null}
        ]
      })]
    })
    const store = TestBed.inject(MockStore)
    const dispatched = vi.spyOn(store, 'dispatch')
    const fixture = TestBed.createComponent(LabelsPage)
    await fixture.whenStable()
    const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T
    const all = (id: string) => Array.from(fixture.nativeElement.querySelectorAll(`[data-cy-id="${id}"]`)) as HTMLElement[]
    return {fixture, store, dispatched, byCy, all}
  }

  it('loads the report and settings when it opens', async () => {
    const {dispatched, all, byCy} = await render()
    expect(dispatched).toHaveBeenCalledWith(LabelAdminActions.loadLabelAdmin())
    expect(all('label-definition')).toHaveLength(3)
    expect(byCy('label-definition-none')).toBeTruthy()
  })

  it('opens the form for a new definition and for an existing one, forgetting the last report', async () => {
    const {fixture, dispatched, byCy, all} = await render()
    byCy('label-definition-new').click()
    await fixture.whenStable()
    expect(byCy('label-key')).toBeTruthy()
    expect(dispatched).toHaveBeenCalledWith(LabelAdminActions.clearLabelReport())

    ;(all('label-definition-edit')[1]).click()
    await fixture.whenStable()
    expect(byCy('label-definition-form').getAttribute('aria-label')).toBe('Edit jenkins-build')
    expect(all('label-definition')[1].classList).toContain('bg-base-200')

    byCy('label-cancel').click()
    await fixture.whenStable()
    expect(byCy('label-definition-form')).toBeNull()
  })

  it('previews and saves what the form sends, and keeps the form on the saved key', async () => {
    const {fixture, dispatched, byCy} = await render()
    byCy('label-definition-new').click()
    await fixture.whenStable()
    const key = byCy<HTMLInputElement>('label-key')
    key.value = 'qa'
    key.dispatchEvent(new Event('input'))
    await fixture.whenStable()
    byCy('label-preview').click()
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: LabelAdminActions.previewLabelDefinition.type, key: 'qa'}))
    byCy('label-save').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: LabelAdminActions.saveLabelDefinition.type, key: 'qa'}))
    expect(fixture.componentInstance.editing()).toEqual({kind: 'key', key: 'qa'})
  })

  it('deletes a definition only after confirming, and closes its form', async () => {
    const {fixture, dispatched, byCy, all} = await render()
    all('label-definition-edit')[2].click()
    all('label-definition-delete')[2].click()
    await fixture.whenStable()
    expect(byCy('label-delete-dialog').classList).toContain('modal-open')
    byCy('label-delete-cancel').click()
    await fixture.whenStable()
    expect(dispatched).not.toHaveBeenCalledWith(LabelAdminActions.deleteLabelDefinition({key: 'revision'}))

    all('label-definition-delete')[2].click()
    await fixture.whenStable()
    byCy('label-delete-confirm').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(LabelAdminActions.deleteLabelDefinition({key: 'revision'}))
    expect(byCy('label-delete-dialog').classList).not.toContain('modal-open')
    expect(byCy('label-definition-form')).toBeNull()
  })

  it('switches to strict only after confirming, naming the labels that don’t fit', async () => {
    const {fixture, dispatched, byCy} = await render({labelValidation: 'OFF'}, [violation])
    expect(byCy('label-validation-OFF').getAttribute('aria-checked')).toBe('true')
    byCy('label-validation-OFF').click()
    byCy('label-validation-STRICT').click()
    await fixture.whenStable()
    expect(byCy('strict-confirmation-dialog').textContent).toContain('1 kind of stored label doesn’t')
    byCy('strict-cancel').click()
    await fixture.whenStable()
    expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({type: LabelAdminActions.saveLabelSettings.type}))

    byCy('label-validation-STRICT').click()
    await fixture.whenStable()
    byCy('strict-confirm').click()
    expect(dispatched).toHaveBeenCalledWith(LabelAdminActions.saveLabelSettings({settings: {labelValidation: 'STRICT'}}))
  })

  it('switches back to off without asking', async () => {
    const {fixture, dispatched, byCy, store} = await render({labelValidation: 'STRICT'})
    byCy('label-validation-OFF').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(LabelAdminActions.saveLabelSettings({settings: {labelValidation: 'OFF'}}))
    expect(byCy('strict-confirmation-dialog').classList).not.toContain('modal-open')
    store.resetSelectors()
  })

  it('disables the switch until the settings are loaded', async () => {
    const {byCy} = await render(null)
    expect(byCy<HTMLButtonElement>('label-validation-STRICT').disabled).toBe(true)
  })
})

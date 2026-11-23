import {afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, Injector, signal, viewChild} from '@angular/core'
import {Store} from '@ngrx/store'
import {Buildz, ILabelDefinition, LabelValidation, theLabelDefinitions} from '../core'
import {PageHeader} from '../ui/page-header'
import {EmptyState} from '../ui/empty-state'
import {LabelDefinitionList} from './ui/label-definition.list'
import {LabelDefinitionDraft, LabelDefinitionForm} from './ui/label-definition.form'
import {LabelViolationsTable} from './ui/label-violations.table'
import {theLabelReport, theLabelSettings, theLabelViolations} from './state/labels-admin.selectors'
import * as LabelAdminActions from './state/labels-admin.actions'

/** What the form is open for: a new definition, the definition of a key, or nothing. */
type Editing = { kind: 'new' } | { kind: 'key', key: string } | null

/**
 * Manages the label definitions (build-bro-api#7): describe label keys, preview and save changes, see which stored
 * labels don't fit, and switch label validation between OFF and STRICT.
 */
@Component({
  template: `
    <div class="flex flex-col gap-6">
      <bb-page-header heading="Labels"
                      description="Describe label keys: their type, allowed values and how they look. Labels without a definition stay free-form.">
        <button type="button" class="btn btn-sm btn-neutral" (click)="startNew()" data-cy-id="label-definition-new">
          <span class="material-icons text-[18px]" aria-hidden="true">add</span>New definition
        </button>
      </bb-page-header>

      <div class="flex flex-wrap items-start gap-6">
        <bb-label-definition-list class="block min-w-0 grow-[999] basis-[420px]" [definitions]="definitions()"
                                  [selectedKey]="editedDefinition()?.key ?? null"
                                  (editDefinition)="edit($event)" (deleteDefinition)="askToDelete($event)"></bb-label-definition-list>
        @if (editing()) {
          <bb-label-definition-form class="block min-w-0 grow basis-80" [definition]="editedDefinition()" [report]="report()"
                                    (previewDefinition)="preview($event)" (saveDefinition)="save($event)"
                                    (cancel)="closeForm()"></bb-label-definition-form>
        } @else {
          <bb-empty-state class="block min-w-0 grow basis-80" icon="edit_note" framed data-cy-id="label-definition-none">
            <p>Choose a definition to edit it, or create a new one.</p>
          </bb-empty-state>
        }
      </div>

      <section class="card bg-base-100 border border-base-300 shadow-sm" aria-labelledby="validation-heading">
        <div class="card-body flex-row flex-wrap items-center gap-4 p-5">
          <div class="min-w-0 grow basis-72">
            <h2 id="validation-heading" class="text-lg font-bold">Validation</h2>
            <p class="text-sm text-base-content/70">
              Strict validation rejects new labels that don't fit their definition. Labels without a definition are always accepted.
            </p>
          </div>
          <div class="join" role="radiogroup" aria-label="Label validation" data-cy-id="label-validation">
            @for (option of validationOptions; track option.value) {
              <button type="button" class="btn btn-sm join-item" role="radio" [attr.aria-checked]="validation() === option.value"
                      [class.btn-neutral]="validation() === option.value" [disabled]="validation() === null"
                      (click)="chooseValidation(option.value)" [attr.data-cy-id]="'label-validation-' + option.value">
                {{ option.name }}
              </button>
            }
          </div>
        </div>
      </section>

      <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-labelledby="violations-heading"
               data-cy-id="label-conformance">
        <div class="px-5 py-4 border-b border-base-300">
          <h2 id="violations-heading" class="text-lg font-bold">Labels that don't fit</h2>
          <p class="text-sm text-base-content/70">Stored labels whose key has a definition, but whose value or entity doesn't fit it.</p>
        </div>
        <div class="px-2 py-2">
          <bb-label-violations-table [violations]="violations()"></bb-label-violations-table>
        </div>
      </section>
    </div>

    <div class="modal" [class.modal-open]="confirmStrict()" role="dialog" aria-modal="true"
         aria-labelledby="strict-dialog-title" (keydown.escape)="confirmStrict.set(false)" data-cy-id="strict-confirmation-dialog">
      @if (confirmStrict()) {
        <div class="modal-box">
          <h3 id="strict-dialog-title" class="text-lg font-bold">Switch to strict validation?</h3>
          <p class="py-4">
            @if (violations().length === 0) {
              All stored labels fit their definitions. From now on, new labels that don't fit are rejected.
            } @else {
              {{ violations().length }} {{ violations().length === 1 ? 'kind of stored label doesn’t' : 'kinds of stored labels don’t' }}
              fit their definition (see "Labels that don't fit"). They stay as they are, but pipelines that keep sending them will fail.
            }
          </p>
          <div class="modal-action">
            <button #strictCancelButton type="button" class="btn btn-ghost" (click)="confirmStrict.set(false)" data-cy-id="strict-cancel">Cancel</button>
            <button type="button" class="btn btn-warning" (click)="saveValidation('STRICT')" data-cy-id="strict-confirm">Switch to strict</button>
          </div>
        </div>
        <div class="modal-backdrop" (click)="confirmStrict.set(false)"></div>
      }
    </div>

    <div class="modal" [class.modal-open]="toDelete() !== null" role="dialog" aria-modal="true"
         aria-labelledby="delete-label-dialog-title" (keydown.escape)="toDelete.set(null)" data-cy-id="label-delete-dialog">
      @if (toDelete(); as definition) {
        <div class="modal-box">
          <h3 id="delete-label-dialog-title" class="text-lg font-bold">Delete the definition of {{ definition.key }}?</h3>
          <p class="py-4">Only the definition is deleted. Labels with this key stay and become free-form again.</p>
          <div class="modal-action">
            <button #deleteCancelButton type="button" class="btn btn-ghost" (click)="toDelete.set(null)" data-cy-id="label-delete-cancel">Cancel</button>
            <button type="button" class="btn btn-error" (click)="confirmDelete()" data-cy-id="label-delete-confirm">Delete</button>
          </div>
        </div>
        <div class="modal-backdrop" (click)="toDelete.set(null)"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, EmptyState, LabelDefinitionList, LabelDefinitionForm, LabelViolationsTable]
})
export class LabelsPage {
  private store = inject<Store<Buildz>>(Store)
  private injector = inject(Injector)

  readonly definitions = this.store.selectSignal(theLabelDefinitions)
  readonly violations = this.store.selectSignal(theLabelViolations)
  readonly report = this.store.selectSignal(theLabelReport)
  private readonly settings = this.store.selectSignal(theLabelSettings)
  /** null until the settings are loaded */
  readonly validation = computed((): LabelValidation | null => this.settings()?.labelValidation ?? null)

  readonly validationOptions: { value: LabelValidation, name: string }[] = [
    {value: 'OFF', name: 'Off'},
    {value: 'STRICT', name: 'Strict'}
  ]

  readonly editing = signal<Editing>(null)
  /** The definition in the form, from the store, so a saved change shows right away; null for a new one. */
  readonly editedDefinition = computed((): ILabelDefinition | null => {
    const editing = this.editing()
    if (editing?.kind !== 'key') return null
    const key = editing.key.toLowerCase()
    return this.definitions().find((definition) => definition.key.toLowerCase() === key) ?? null
  })
  readonly toDelete = signal<ILabelDefinition | null>(null)
  readonly confirmStrict = signal(false)
  private readonly deleteCancelButton = viewChild<ElementRef<HTMLButtonElement>>('deleteCancelButton')
  private readonly strictCancelButton = viewChild<ElementRef<HTMLButtonElement>>('strictCancelButton')

  constructor() {
    this.store.dispatch(LabelAdminActions.loadLabelAdmin())
  }

  startNew(): void {
    this.store.dispatch(LabelAdminActions.clearLabelReport())
    this.editing.set({kind: 'new'})
  }

  edit(definition: ILabelDefinition): void {
    this.store.dispatch(LabelAdminActions.clearLabelReport())
    this.editing.set({kind: 'key', key: definition.key})
  }

  closeForm(): void {
    this.editing.set(null)
  }

  preview({key, definition}: LabelDefinitionDraft): void {
    this.store.dispatch(LabelAdminActions.previewLabelDefinition({key, definition}))
  }

  save({key, definition}: LabelDefinitionDraft): void {
    this.store.dispatch(LabelAdminActions.saveLabelDefinition({key, definition}))
    // a new definition: keep the form open on it, it fills in once the store has it
    this.editing.set({kind: 'key', key})
  }

  askToDelete(definition: ILabelDefinition): void {
    this.toDelete.set(definition)
    afterNextRender(() => this.deleteCancelButton()?.nativeElement.focus(), {injector: this.injector})
  }

  confirmDelete(): void {
    const definition = this.toDelete()
    if (definition) {
      this.store.dispatch(LabelAdminActions.deleteLabelDefinition({key: definition.key}))
      if (this.editedDefinition()?.key === definition.key) this.closeForm()
    }
    this.toDelete.set(null)
  }

  /** Strict asks first, since pipelines may start to fail; off needs no confirmation. */
  chooseValidation(validation: LabelValidation): void {
    if (validation === this.validation()) return
    if (validation === 'STRICT') {
      this.confirmStrict.set(true)
      afterNextRender(() => this.strictCancelButton()?.nativeElement.focus(), {injector: this.injector})
    } else {
      this.saveValidation(validation)
    }
  }

  saveValidation(validation: LabelValidation): void {
    this.store.dispatch(LabelAdminActions.saveLabelSettings({settings: {labelValidation: validation}}))
    this.confirmStrict.set(false)
  }
}

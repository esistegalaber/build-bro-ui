import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core'
import {debounce, form, FormField, min} from '@angular/forms/signals'
import {EditableBuildTemplate, ILabelDefinition, IProject, labelProblems} from '../../core'
import {storeDraft, TYPING_PAUSE_MS} from '../../ui/forms/store-draft'
import {formatLabels, parseLabels} from '../state/utils'

/**
 * What a row edits, flat: Signal Forms mark objects inside arrays to track them, and the store's
 * row holds the project with its (frozen) branches, so the form gets only these fields.
 */
interface RowFields {
  /** the branch's name, empty when none is chosen */
  branch: string
  /** empty for the latest */
  buildNumber: number | null
  /** the label filter as text: key=value, key=value */
  labels: string
}

/**
 * One project of the build set as a compact row: switch, name, and, when the project is included, its branch,
 * build number (empty: the latest) and label filter. An excluded project is a single muted line.
 * Edits a draft of the row (see storeDraft); every change goes out as a new row, the input stays untouched.
 */
@Component({
  selector: 'bb-build-template-form',
  template: `
    @let row = template();
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-base-300 px-5 py-3"
         [class.text-base-content/60]="!row.projectSelected" attr.data-testid="build-template-{{row.project.name}}">
      <input type="checkbox" class="toggle toggle-success toggle-sm" [checked]="row.projectSelected" (change)="projectSelection()"
             [attr.aria-label]="'Include ' + row.project.name" data-testid="project-toggle"/>
      <div class="flex min-w-0 grow basis-28 flex-wrap items-center gap-2">
        <span [class.font-semibold]="row.projectSelected">{{ row.project.name }}</span>
        @if (row.projectSelected && row.buildNumber != null) {
          <span class="badge badge-soft badge-warning badge-sm" data-testid="template-pinned">pinned</span>
        }
      </div>
      @if (row.projectSelected) {
        <select class="select select-sm w-36 grow sm:grow-0" data-testid="template-branch-select"
                [attr.aria-label]="'Branch of ' + row.project.name" [formField]="rowForm.branch">
          <option value="">Choose a branch</option>
          @for (branch of row.project.branches; track branch.id) {
            <option [value]="branch.name">{{ branch.name }}</option>
          }
        </select>
        <input class="input input-sm w-24 font-mono" type="number" placeholder="latest" data-testid="template-build-number"
               [attr.aria-label]="'Build number of ' + row.project.name + ', empty for the latest'"
               [formField]="rowForm.buildNumber">
        <input class="input input-sm w-36 grow sm:grow-0" type="text" placeholder="key=value" data-testid="template-labels"
               [attr.aria-label]="'Label filter of ' + row.project.name + ', as key=value, key=value'"
               [formField]="rowForm.labels">
        @if (labelHints().length > 0) {
          <!-- the API rejects such a template when label validation is strict, and no build could match it anyway -->
          <ul class="basis-full text-xs text-base-content/80 sm:ps-12" role="status" data-testid="template-label-hints">
            @for (hint of labelHints(); track hint) {
              <li class="flex items-center gap-1">
                <span class="material-icons text-[14px] text-warning" aria-hidden="true">warning</span>{{ hint }}
              </li>
            }
          </ul>
        }
      } @else {
        <span class="w-[25.5rem] max-w-full text-sm">Not included</span>
      }
    </div>
  `,
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildTemplateForm {
  readonly template = input.required<EditableBuildTemplate>()
  /** Label definitions, to point out label filters that no build could match */
  readonly labelDefinitions = input<ILabelDefinition[]>([])
  readonly templateUpdated = output<EditableBuildTemplate>()
  readonly projectAdded = output<IProject>()
  readonly projectRemoved = output<IProject>()

  /** The label filters that don't fit their definition, e.g. "integration-test=passed: expected one of ok, broken" */
  readonly labelHints = computed(() => labelProblems(this.template().labels, this.labelDefinitions(), 'BUILD'))

  private readonly fieldsFromStore = computed((): RowFields => {
    const row = this.template()
    return {branch: row.branch?.name ?? '', buildNumber: row.buildNumber, labels: formatLabels(row.labels)}
  })
  private readonly draft = storeDraft(() => this.fieldsFromStore(), (fields) => this.templateUpdated.emit(this.toRow(fields)))
  readonly rowForm = form(this.draft.model, (fields) => {
    // a build number typed quickly is verified once, not once per keystroke
    debounce(fields.buildNumber, TYPING_PAUSE_MS)
    min(fields.buildNumber, 1)
    // a label filter counts once it is complete: when the field is left
    debounce(fields.labels, 'blur')
  })

  projectSelection(): void {
    const row = this.template()
    if (row.projectSelected) {
      this.projectRemoved.emit(row.project)
    } else {
      this.projectAdded.emit(row.project)
    }
  }

  private toRow(fields: RowFields): EditableBuildTemplate {
    const row = this.template()
    return {
      ...row,
      branch: row.project.branches.find((b) => b.name === fields.branch) ?? null,
      buildNumber: fields.buildNumber,
      labels: parseLabels(fields.labels)
    }
  }
}

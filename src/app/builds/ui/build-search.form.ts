import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core'
import {KeyValuePipe} from '@angular/common'
import {debounce, form, FormField, FormRoot, min} from '@angular/forms/signals'
import {definitionOf, IBuildSearchParams, ILabelDefinition, ISearchData} from '../../core'
import {LabelChip} from '../../ui/labels/label-chip'
import {storeDraft, TYPING_PAUSE_MS} from '../../ui/forms/store-draft'

/**
 * The filters of the builds search. A Signal Form on top of the store's search: it never changes its input,
 * it works on its own copy (`model`), which starts over whenever the store sends a new search.
 */
@Component({
  selector: 'bb-build-search-form',
  template: `
    <form [formRoot]="searchForm" aria-label="Filters" class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body gap-4 p-5">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] items-end gap-3">
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Project
            <select class="select select-sm w-full" data-cy-id="project-select" [formField]="searchForm.project">
              <option value="">All projects</option>
              @for (project of available().projectNames; track project) {
                <option [value]="project">{{ project }}</option>
              }
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Branch
            <select class="select select-sm w-full" data-cy-id="branch-select" [formField]="searchForm.branch">
              <option value="">All branches</option>
              @for (branch of available().projectBranches[model().project]; track branch) {
                <option [value]="branch">{{ branch }}</option>
              }
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Build number from
            <input type="number" placeholder="min" class="input input-sm w-full"
                   data-cy-id="min-build-number-input" [formField]="searchForm.minBuildNumber"/>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">to
            <input type="number" placeholder="max" class="input input-sm w-full"
                   data-cy-id="max-build-number-input" [formField]="searchForm.maxBuildNumber"/>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Per page
            <!-- a native select only binds to text fields, and the page size is a number -->
            <select class="select select-sm w-full" data-cy-id="page-size-select" (change)="choosePageSize($event)">
              @for (size of pageSizes; track size) {
                <option [value]="size" [selected]="size === model().pageSize">{{ size }}</option>
              }
            </select>
          </label>
        </div>

        <div class="flex flex-wrap items-end gap-3">
          <label class="flex grow basis-40 flex-col gap-1 text-xs font-semibold text-base-content/70">Label
            <input class="input input-sm w-full" type="text" placeholder="key, e.g. integration-test"
                   data-cy-id="label-key-input" [formField]="labelForm.key">
          </label>
          <label class="flex grow basis-40 flex-col gap-1 text-xs font-semibold text-base-content/70">Value
            <input class="input input-sm w-full" type="text" placeholder="value"
                   data-cy-id="label-value-input" [formField]="labelForm.value">
          </label>
          <button type="button" class="btn btn-sm btn-soft btn-primary" [disabled]="!canAddLabel()" (click)="addSearchLabel()"
                  data-cy-id="label-add">
            <span class="material-icons text-[18px]" aria-hidden="true">add</span>Add label
          </button>
          <div class="ms-auto flex gap-2">
            <button type="button" class="btn btn-sm btn-ghost" (click)="reset()" data-cy-id="search-reset">
              <span class="material-icons text-[18px]" aria-hidden="true">restart_alt</span>Reset
            </button>
            <button type="submit" class="btn btn-sm btn-primary" data-cy-id="search-reload">
              <span class="material-icons text-[18px]" aria-hidden="true">refresh</span>Reload
            </button>
          </div>
        </div>

        @if (hasLabels()) {
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-base-content/70">Label filters</span>
            @for (label of model().labels | keyvalue; track label.key) {
              <bb-label-chip [labelKey]="label.key" [value]="label.value" [definition]="definitionOf(label.key)"
                             data-cy-id="search-label">
                <button type="button" class="btn btn-ghost btn-xs btn-circle" (click)="removeSearchLabel(label.key)"
                        [attr.aria-label]="'Remove the label filter ' + label.key" data-cy-id="search-label-remove">
                  <span class="material-icons text-[16px]" aria-hidden="true">close</span>
                </button>
              </bb-label-chip>
            }
          </div>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, FormRoot, FormField, LabelChip]
})
export class BuildSearchForm {
  readonly available = input.required<ISearchData>()
  readonly theSearch = input.required<IBuildSearchParams>()
  readonly resetSearch = output<void>()
  readonly updateSearch = output<IBuildSearchParams>()

  readonly pageSizes = [10, 25, 50]

  /** The search being edited: starts over from the store's search, and every change goes out as a new search. */
  private readonly draft = storeDraft(() => this.theSearch(), (search) => this.updateSearch.emit(search))
  readonly model = this.draft.model
  readonly searchForm = form(this.model, (search) => {
    // a number typed quickly starts one search, not one per keystroke
    debounce(search.minBuildNumber, TYPING_PAUSE_MS)
    debounce(search.maxBuildNumber, TYPING_PAUSE_MS)
    // build numbers start at 1 (also sets the inputs' min attribute)
    min(search.minBuildNumber, 1)
    min(search.maxBuildNumber, 1)
  }, {
    // Enter and Reload: submitting first takes over the values still waiting for typing to pause
    submission: {action: async () => this.draft.send(this.model())}
  })

  readonly labelForm = form(signal({key: '', value: ''}))
  readonly canAddLabel = computed(() => {
    const {key, value} = this.labelForm().value()
    return key.trim().length > 0 && value.trim().length > 0
  })
  readonly hasLabels = computed(() => Object.keys(this.model().labels ?? {}).length > 0)

  reset(): void {
    // drop a number still waiting for typing to pause, or it would come back after the reset
    this.searchForm().reset()
    this.resetSearch.emit()
  }

  definitionOf(key: string): ILabelDefinition | undefined {
    return definitionOf(key, this.available().labelDefinitions)
  }

  addSearchLabel(): void {
    const {key, value} = this.labelForm().value()
    this.model.update((search) => ({...search, labels: {...search.labels, [key.trim()]: value.trim()}}))
    this.labelForm().reset({key: '', value: ''})
  }

  removeSearchLabel(key: string): void {
    this.model.update((search) => {
      const {[key]: _, ...labels} = search.labels
      return {...search, labels}
    })
  }

  choosePageSize(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value)
    this.model.update((search) => ({...search, pageSize}))
  }
}

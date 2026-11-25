import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, output} from '@angular/core'
import {RouterLink} from '@angular/router'
import {form, FormField, FormRoot, required} from '@angular/forms/signals'
import {EditableBuildSetTemplate} from '../../core'

/**
 * The edit page's header: breadcrumb, title, Clone (for saved build sets) and Save, and the name field.
 * The typed name is kept here until Save: it only starts over when the store's name changes (load, clone, save),
 * not when other parts of the build set change.
 */
@Component({
  selector: 'bb-build-set-name-form',
  template: `
    <form [formRoot]="nameForm" class="flex flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-1">
          <nav aria-label="Breadcrumb" class="text-sm text-base-content/70">
            <a routerLink="/build-sets" class="link link-hover">Build sets</a> / {{ savedName() ?? (cloned() ? 'clone' : 'new') }}
          </nav>
          <h1 class="text-3xl font-extrabold tracking-tight break-words" data-testid="build-set-title">{{ name() || 'New build set' }}</h1>
        </div>
        <div class="flex flex-wrap gap-2">
          @if (savedName(); as savedName) {
            <a class="btn btn-soft btn-primary" [routerLink]="['/edit-build-set', 'clone', savedName]" data-testid="build-set-clone-action">
              <span class="material-icons text-[18px]" aria-hidden="true">content_copy</span>Clone
            </a>
          }
          <button type="submit" class="btn btn-primary" [disabled]="nameForm().invalid()" data-testid="build-set-save">
            <span class="material-icons text-[18px]" aria-hidden="true">check</span>Save build set
          </button>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-5">
          <label class="flex max-w-md flex-col gap-1 text-xs font-semibold text-base-content/70">Name
            <input type="text" placeholder="Name of your build set" class="input w-full"
                   data-testid="build-set-name-input" [formField]="nameForm">
          </label>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormRoot, FormField]
})
export class BuildSetNameForm {
  /** The build set as the store has it: its name and projects. */
  readonly editableTemplate = input.required<EditableBuildSetTemplate>()
  /** The name of the build set as saved, or null for a new or cloned one that isn't saved yet. */
  readonly savedName = input<string | null>(null)
  /** True for a copy of another build set that isn't saved yet. */
  readonly cloned = input(false)
  readonly save = output<EditableBuildSetTemplate>()

  private readonly nameFromStore = computed(() => this.editableTemplate().name)
  /** the typed name: starts over only when the store's name changes */
  readonly name = linkedSignal(() => this.nameFromStore())
  readonly nameForm = form(this.name, (name) => required(name), {
    submission: {action: async () => this.save.emit({...this.editableTemplate(), name: this.name()})}
  })
}

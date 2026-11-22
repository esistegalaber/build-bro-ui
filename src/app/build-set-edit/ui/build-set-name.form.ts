import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {RouterModule} from "@angular/router";
import {EditableBuildSetTemplate} from "../../core";
import {FormsModule} from "@angular/forms";

/**
 * The edit page's header: breadcrumb, title, Clone (for saved build sets) and Save, and the name field.
 * The typed name is kept here, so changes elsewhere in the store don't overwrite it while it is being edited.
 */
@Component({
  selector: 'bb-build-set-name-form',
  template: `
    <form #theForm="ngForm" (ngSubmit)="saveWithName()" class="flex flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-1">
          <nav aria-label="Breadcrumb" class="text-sm text-base-content/70">
            <a routerLink="/build-sets" class="link link-hover">Build sets</a> / {{ savedName ?? (cloned ? 'clone' : 'new') }}
          </nav>
          <h1 class="text-3xl font-extrabold tracking-tight break-words" data-cy-id="build-set-title">{{ name || 'New build set' }}</h1>
        </div>
        <div class="flex flex-wrap gap-2">
          @if (savedName) {
            <a class="btn btn-soft btn-primary" [routerLink]="['/edit-build-set', 'clone', savedName]" data-cy-id="build-set-clone-action">
              <span class="material-icons text-[18px]" aria-hidden="true">content_copy</span>Clone
            </a>
          }
          <button type="submit" class="btn btn-primary" [disabled]="theForm.invalid" data-cy-id="build-set-save">
            <span class="material-icons text-[18px]" aria-hidden="true">check</span>Save build set
          </button>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-5">
          <label class="flex max-w-md flex-col gap-1 text-xs font-semibold text-base-content/70">Name
            <input name="templateName" required type="text" placeholder="Name of your build set" class="input w-full"
                   data-cy-id="build-set-name-input" [(ngModel)]="name">
          </label>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterModule]
})
export class BuildSetNameForm {
  /** The name of the build set as saved, or null for a new or cloned one that isn't saved yet. */
  @Input()
  savedName: string | null = null
  /** True for a copy of another build set that isn't saved yet. */
  @Input()
  cloned = false
  @Output()
  save = new EventEmitter<EditableBuildSetTemplate>();

  name = ''
  private template!: EditableBuildSetTemplate
  private nameFromStore: string | null = null

  @Input({required: true})
  set editableTemplate(template: EditableBuildSetTemplate) {
    this.template = template
    // only take the name over when the store's name changed (load, clone, save), not on every other update
    if (template.name !== this.nameFromStore) {
      this.nameFromStore = template.name
      this.name = template.name
    }
  }

  get editableTemplate(): EditableBuildSetTemplate {
    return this.template
  }

  saveWithName(): void {
    this.save.emit({...this.template, name: this.name})
  }
}

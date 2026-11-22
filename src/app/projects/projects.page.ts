import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {Store} from '@ngrx/store'
import {Buildz} from '../core'
import * as CoreActions from '../core/actions'
import {includeInactiveData, projectsData} from '../core/state/projects/project.selectors'
import {BranchSwitch, ProjectCard} from './ui/project.card'
import {filterProjects} from './projects.filter'

@Component({
  template: `
    <div class="flex flex-col gap-6">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Projects</h1>
          <p class="text-base-content/70">Turn off branches you no longer build, so they stay out of the way.</p>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="toggle toggle-success" [checked]="inactiveIncluded()"
                 (change)="toggleInactive($event)" data-cy-id="inactive-toggle"/>
          <span class="font-medium">Show inactive</span>
        </label>
      </header>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-bold" data-cy-id="projects-count">
          {{ shown().length }} {{ shown().length === 1 ? 'project' : 'projects' }}
        </h2>
        <label class="input w-full sm:w-72">
          <span class="material-icons text-[18px] text-base-content/50" aria-hidden="true">search</span>
          <input type="search" placeholder="Search projects and branches" aria-label="Search projects and branches"
                 [value]="search()" (input)="search.set($any($event.target).value)" data-cy-id="projects-search"/>
        </label>
      </div>

      @if (shown().length > 0) {
        <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] items-start gap-4">
          @for (project of shown(); track project.id) {
            <bb-project-card [project]="project" (switchBranch)="switchBranch($event)"></bb-project-card>
          }
        </div>
      } @else if (search()) {
        <div class="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 px-5 py-10 text-center text-base-content/70"
             data-cy-id="projects-empty">
          <span class="material-icons text-4xl!" aria-hidden="true">search_off</span>
          <p>No project or branch matches “{{ search() }}”.</p>
          <button type="button" class="btn btn-sm btn-soft btn-primary" (click)="search.set('')" data-cy-id="projects-search-clear">Clear search</button>
        </div>
      } @else {
        <p class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/70" data-cy-id="projects-none">
          No projects yet. They appear here with their first build.
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCard]
})
export class ProjectsPage {
  private store = inject<Store<Buildz>>(Store)

  readonly inactiveIncluded = toSignal(this.store.select(includeInactiveData), {initialValue: false})
  private readonly projects = toSignal(this.store.select(projectsData), {initialValue: []})
  readonly search = signal('')
  readonly shown = computed(() => filterProjects(this.projects(), this.search()))

  switchBranch({branchId, active}: BranchSwitch): void {
    this.store.dispatch(active ? CoreActions.activateBranch({branchId}) : CoreActions.deactivateBranch({branchId}))
  }

  toggleInactive(event: Event): void {
    // the store decides, as for the branch switches
    (event.target as HTMLInputElement).checked = this.inactiveIncluded()
    this.store.dispatch(CoreActions.toggleInactiveData())
  }
}

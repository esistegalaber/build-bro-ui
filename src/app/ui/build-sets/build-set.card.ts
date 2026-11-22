import {ChangeDetectionStrategy, Component, computed, input, output} from "@angular/core";
import {RouterLink} from "@angular/router";
import {IBuild, IBuildSet} from "../../core";
import {BuildSetSummary} from "../../build-sets/state/build-sets.model";
import {BuildsAccordion} from "../builds/builds.accordion";

/** The selected build set: its summary, the actions Edit, Clone and Delete, and the builds it resolves to. */
import {EmptyState} from '../empty-state'
@Component({
  selector: 'bb-build-set-card',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" data-cy-id="build-set-card">
      <div class="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-base-300">
        <div class="min-w-0">
          <h2 class="text-lg font-bold break-all">Builds of {{ buildSet().name }}</h2>
          @if (summary(); as summary) {
            <p class="text-sm text-base-content/70">
              @if (summary.projects === 0) {
                No projects yet
              } @else {
                {{ summary.projects }} {{ summary.projects === 1 ? 'project' : 'projects' }}@if (summary.pinned > 0) {, {{ summary.pinned }} pinned to a build number}
              }
            </p>
          }
        </div>
        <div class="flex flex-wrap gap-2">
          <a class="btn btn-sm btn-primary" [routerLink]="['/edit-build-set', buildSet().name]" data-cy-id="build-set-edit">
            <span class="material-icons text-[18px]" aria-hidden="true">edit</span>Edit
          </a>
          <a class="btn btn-sm btn-soft btn-primary" [routerLink]="['/edit-build-set', 'clone', buildSet().name]" data-cy-id="build-set-clone">
            <span class="material-icons text-[18px]" aria-hidden="true">content_copy</span>Clone
          </a>
          <button type="button" class="btn btn-sm btn-ghost text-error" (click)="deleteBuildSet.emit(buildSet())" data-cy-id="build-set-delete">
            <span class="material-icons text-[18px]" aria-hidden="true">delete</span>Delete
          </button>
        </div>
      </div>
      @if (builds().length > 0) {
        <bb-builds-accordion [builds]="builds()"></bb-builds-accordion>
      } @else {
        <bb-empty-state icon="layers_clear" data-cy-id="build-set-empty">
          <p>This build set has no builds yet: it has no projects, or none of them has a matching build.</p>
          <a class="btn btn-sm" [routerLink]="['/edit-build-set', buildSet().name]">Add projects</a>
        </bb-empty-state>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BuildsAccordion, EmptyState]
})
export class BuildSetCard {
  readonly buildSet = input.required<IBuildSet>()
  readonly summary = input<BuildSetSummary | null>(null)
  readonly deleteBuildSet = output<IBuildSet>()

  readonly builds = computed((): IBuild[] => Object.values(this.buildSet().builds))
}

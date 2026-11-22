import {ChangeDetectionStrategy, Component, input} from '@angular/core'
import {RouterLink} from '@angular/router'
import {BuildSetSummary} from '../../build-sets/state/build-sets.model'

/** The build sets with a short summary each, linking to their edit page, and a "New" action. */
@Component({
  selector: 'bb-home-build-sets',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm" aria-label="Build sets">
      <div class="card-body gap-2 p-5">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-lg font-bold">Build sets</h2>
          <a routerLink="/edit-build-set" class="btn btn-sm btn-soft btn-primary" data-cy-id="home-new-build-set">
            <span class="material-icons text-[18px]" aria-hidden="true">add</span>New
          </a>
        </div>
        @if (buildSets(); as buildSets) {
          <ul>
            @for (summary of buildSets; track summary.name) {
              <li class="border-t border-base-300">
                <a [routerLink]="['/edit-build-set', summary.name]" attr.data-cy-id="home-build-set-{{summary.name}}"
                   class="-mx-2 flex items-center gap-3 rounded-box px-2 py-3 hover:bg-base-200">
                  <span class="size-9 shrink-0 rounded-xl bg-base-200 text-base-content/70 grid place-items-center" aria-hidden="true">
                    <span class="material-icons text-[18px]">layers</span>
                  </span>
                  <span class="min-w-0 grow">
                    <span class="block font-semibold break-all">{{ summary.name }}</span>
                    <span class="block text-sm text-base-content/70">
                      @if (summary.projects === 0) {
                        No projects yet
                      } @else {
                        {{ summary.projects }} {{ summary.projects === 1 ? 'project' : 'projects' }}@if (summary.pinned > 0) { · {{ summary.pinned }} pinned}
                      }
                    </span>
                  </span>
                  <span class="material-icons text-base-content/50" aria-hidden="true">chevron_right</span>
                </a>
              </li>
            } @empty {
              <li class="border-t border-base-300 py-6 text-center text-base-content/70" data-cy-id="home-build-sets-none">No build sets yet.</li>
            }
          </ul>
        } @else {
          <div class="border-t border-base-300 py-6 text-center"><span class="text-base-content/70">Loading…</span></div>
        }
      </div>
    </section>
  `,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeBuildSets {
  /** null while loading */
  readonly buildSets = input.required<BuildSetSummary[] | null>()
}

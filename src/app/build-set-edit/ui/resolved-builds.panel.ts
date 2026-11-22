import {ChangeDetectionStrategy, Component, computed, input} from "@angular/core";
import {EditableBuildTemplate, IBuild} from "../../core";
import {BuildSummaryPipe} from "../../ui/builds/build-summary.pipe";

interface ResolvedRow {
  project: string
  branch: string | null
  pinned: boolean
  build: IBuild | null
}

/** Which build each included project resolves to (from the API's verification), with pins and problems marked. */
import {EmptyState} from '../../ui/empty-state'
@Component({
  selector: 'bb-resolved-builds',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm" aria-label="Resolved builds">
      <div class="card-body gap-3 p-5">
        <div>
          <h2 class="text-lg font-bold">Resolves to</h2>
          <p class="text-sm text-base-content/70">The build each included project resolves to right now.</p>
        </div>
        @for (row of rows(); track row.project) {
          <div class="flex flex-col gap-1 border-t border-base-300 pt-2" attr.data-cy-id="resolved-{{row.project}}">
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 grow truncate font-semibold">{{ row.project }}</span>
              @if (row.build; as build) {
                <span class="font-mono font-medium" attr.data-cy-id="build-{{build.id}}">#{{ build.buildNumber }}</span>
              }
            </div>
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-base-content/70">
              @if (row.build; as build) {
                <span class="flex items-center gap-1"><span class="material-icons text-[14px]" aria-hidden="true">call_split</span>{{ build.branch }}</span>
                @if (row.pinned) {
                  <span class="badge badge-soft badge-warning badge-sm">pinned</span>
                }
                @let summary = build | buildSummary;
                @if (summary.testStatus) {
                  <span class="badge badge-soft badge-sm" [class.badge-success]="summary.testStatus === 'ok'"
                        [class.badge-error]="summary.testStatus === 'broken'">tests {{ summary.testStatus }}</span>
                }
              } @else if (row.branch) {
                <span class="badge badge-soft badge-warning badge-sm" data-cy-id="resolved-missing">no matching build</span>
              } @else {
                <span data-cy-id="resolved-no-branch">choose a branch</span>
              }
            </div>
          </div>
        } @empty {
          <bb-empty-state framed compact data-cy-id="resolved-none">
            <p>Switch on a project to see which build it resolves to.</p>
          </bb-empty-state>
        }
      </div>
    </section>
  `,
  imports: [BuildSummaryPipe, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResolvedBuildsPanel {
  /** The builds the API resolved the template to. */
  readonly builds = input.required<IBuild[]>()
  readonly templates = input.required<EditableBuildTemplate[]>()

  /** One row per included project, in the list's order; projects that were switched off are left out. */
  readonly rows = computed((): ResolvedRow[] => this.templates()
    .filter((t) => t.projectSelected)
    .map((t) => ({
      project: t.project.name,
      branch: t.branch?.name ?? null,
      pinned: t.buildNumber != null,
      build: this.builds().find((b) => b.project === t.project.name) ?? null
    })))
}

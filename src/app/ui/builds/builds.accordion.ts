import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from '../../core'
import {SortedLabelsPipe} from "../../core/pipes/sort-label.pipe";
import {BuildSummaryPipe} from "./build-summary.pipe";

/**
 * A list of builds, one row each: project, branch, test status, short revision and build number.
 * A row expands to show all labels. Used on the builds page, in build sets, the edit page and deployments.
 */
@Component({
  selector: 'bb-builds-accordion',
  template: `
    @for (build of builds; track build.id) {
      @let summary = build | buildSummary;
      <div class="collapse collapse-arrow rounded-none border-b border-base-300 last:border-b-0" data-cy-id="build-row">
        <input type="checkbox" attr.data-cy-id="build-{{build.id}}"
               [attr.aria-label]="'Show the labels of ' + build.project + ' ' + build.branch + ' #' + build.buildNumber"/>
        <div class="collapse-title flex flex-wrap items-center gap-x-4 gap-y-2 py-3 pe-12">
          <span class="size-10 shrink-0 rounded-xl bg-base-200 text-base-content/70 grid place-items-center" aria-hidden="true">
            <span class="material-icons text-[20px]">inventory_2</span>
          </span>
          <span class="flex flex-col min-w-0 grow basis-40">
            <span class="font-semibold">{{ build.project }}</span>
            <span class="flex items-center gap-1 text-sm text-base-content/70">
              <span class="material-icons text-[16px]" aria-hidden="true">call_split</span>{{ build.branch }}
            </span>
          </span>
          @if (summary.testStatus) {
            <span class="badge badge-soft" [class.badge-success]="summary.testStatus === 'ok'"
                  [class.badge-error]="summary.testStatus === 'broken'" data-cy-id="build-test-status">tests {{ summary.testStatus }}</span>
          }
          @if (summary.revision) {
            <span class="hidden sm:inline font-mono text-sm text-base-content/70" title="Revision">{{ summary.revision }}</span>
          }
          <span class="min-w-12 text-right font-mono text-lg font-medium">#{{ build.buildNumber }}</span>
        </div>
        <div class="collapse-content">
          <dl class="grid grid-cols-1 sm:grid-cols-[minmax(7rem,12rem)_minmax(0,1fr)] gap-x-4 rounded-box bg-base-200 px-4 py-1 text-sm">
            <dt class="pt-2 sm:pb-2 text-base-content/70">Build Bruh ID</dt>
            <dd class="pb-2 sm:pt-2 font-mono">{{ build.id }}</dd>
            @for (label of build.labels | sortedLabels; track label.id) {
              <dt class="pt-2 sm:pb-2 border-t border-base-300 text-base-content/70">{{ label.key }}</dt>
              <dd class="pb-2 sm:pt-2 sm:border-t border-base-300 font-mono break-all">{{ label.value }}</dd>
            }
          </dl>
        </div>
      </div>
    }
  `,
  imports: [SortedLabelsPipe, BuildSummaryPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}

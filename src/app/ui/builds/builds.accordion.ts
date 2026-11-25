import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {definitionOf, IBuild, ILabelDefinition} from '../../core'
import {SortedLabelsPipe} from "../../core/pipes/sort-label.pipe";
import {LabelChip} from "../labels/label-chip";

/**
 * A list of builds, one row each: project, branch and build number.
 * A row expands to show all labels. Used on the builds page, in build sets, the edit page and deployments.
 */
@Component({
  selector: 'bb-builds-accordion',
  template: `
    @for (build of builds; track build.id) {
      <div class="collapse collapse-arrow rounded-none border-b border-base-300 last:border-b-0" data-testid="build-row">
        <input type="checkbox" attr.data-testid="build-{{build.id}}"
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
          <span class="min-w-12 text-right font-mono text-lg font-medium">#{{ build.buildNumber }}</span>
        </div>
        <div class="collapse-content">
          <dl class="grid grid-cols-1 sm:grid-cols-[minmax(7rem,12rem)_minmax(0,1fr)] gap-x-4 rounded-box bg-base-200 px-4 py-1 text-sm">
            <dt class="pt-2 sm:pb-2 text-base-content/70">Build Bruh ID</dt>
            <dd class="pb-2 sm:pt-2 font-mono">{{ build.id }}</dd>
            @for (label of build.labels | sortedLabels; track label.id) {
              @let definition = definitionOf(label.key);
              <dt class="pt-2 sm:pb-2 border-t border-base-300 text-base-content/70"
                  [attr.title]="definition?.displayName ? label.key : null">{{ definition?.displayName || label.key }}</dt>
              <dd class="pb-2 sm:pt-2 sm:border-t border-base-300 font-mono break-all">
                <bb-label-chip mode="value" [labelKey]="label.key" [value]="label.value" [definition]="definition"></bb-label-chip>
              </dd>
            }
          </dl>
        </div>
      </div>
    }
  `,
  imports: [SortedLabelsPipe, LabelChip],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
  /** Label definitions, to show labels by their type and style */
  @Input()
  labelDefinitions: ILabelDefinition[] = []

  definitionOf(key: string): ILabelDefinition | undefined {
    return definitionOf(key, this.labelDefinitions)
  }
}

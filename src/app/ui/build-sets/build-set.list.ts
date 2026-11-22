import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";
import {NgClass} from "@angular/common";
import {BuildSetSummary} from "../../build-sets/state/build-sets.model";

/** All build sets with a short summary each; the selected one is highlighted. */
@Component({
  selector: 'bb-build-set-list',
  template: `
    <nav class="card bg-base-100 border border-base-300 shadow-sm" aria-label="Build sets">
      <ul class="menu w-full gap-1 p-2">
        @for (summary of summaries(); track summary.name) {
          <li>
            <button type="button" class="flex flex-col items-start gap-0.5 py-2 text-left"
                    [ngClass]="{'menu-active bg-primary/10 text-primary': summary.name === selectedName()}"
                    [attr.aria-current]="summary.name === selectedName() ? 'true' : null"
                    (click)="buildSetSelected.emit(summary.name)" attr.data-cy-id="build-set-name-{{summary.name}}">
              <span class="font-semibold break-all">{{ summary.name }}</span>
              <span class="text-xs opacity-70">
                @if (summary.projects === 0) {
                  No projects yet
                } @else {
                  {{ summary.projects }} {{ summary.projects === 1 ? 'project' : 'projects' }}@if (summary.pinned > 0) { · {{ summary.pinned }} pinned}
                }
              </span>
            </button>
          </li>
        } @empty {
          <li class="px-4 py-6 text-center text-sm text-base-content/70" data-cy-id="build-sets-none">No build sets yet.</li>
        }
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class BuildSetList {
  readonly summaries = input.required<BuildSetSummary[]>()
  readonly selectedName = input<string | null>(null)
  readonly buildSetSelected = output<string>()
}

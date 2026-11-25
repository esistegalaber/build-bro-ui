import {ChangeDetectionStrategy, Component, input, output} from '@angular/core'
import {IBranch, IProject} from '../../core'

/** A branch to switch on or off. */
export interface BranchSwitch {
  branchId: number
  active: boolean
}

/** One project with its branches; each branch has a switch that turns it on or off. */
@Component({
  selector: 'bb-project-card',
  template: `
    @let project = this.project();
    <section class="card bg-base-100 border border-base-300 shadow-sm" [attr.aria-label]="project.name"
             attr.data-testid="project-{{project.name}}">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-base-300">
        <span class="size-9 shrink-0 rounded-xl bg-base-200 text-base-content/70 grid place-items-center" aria-hidden="true">
          <span class="material-icons text-[18px]">folder</span>
        </span>
        <div class="min-w-0 grow">
          <h2 class="font-bold wrap-anywhere" [class.text-base-content/60]="!project.active">{{ project.name }}</h2>
          <p class="text-sm text-base-content/70" data-testid="project-summary">{{ summary() }}</p>
        </div>
        @if (!project.active) {
          <span class="badge badge-ghost gap-1" data-testid="project-inactive">
            <span class="material-icons text-[14px]" aria-hidden="true">pause_circle</span>Inactive
          </span>
        }
      </div>
      <ul class="py-1">
        @for (branch of project.branches; track branch.id) {
          <li class="flex items-center gap-3 px-5 py-2" attr.data-testid="branch-{{branch.id}}">
            <span class="material-icons text-[18px] text-base-content/50" aria-hidden="true">call_split</span>
            <span class="min-w-0 grow font-mono text-sm wrap-anywhere" [class.text-base-content/60]="!branch.active"
                  data-testid="branch-name">{{ branch.name }}</span>
            @if (!branch.active) {
              <span class="text-xs font-medium text-base-content/60" data-testid="branch-inactive">Inactive</span>
            }
            <input type="checkbox" class="toggle toggle-sm toggle-success" [checked]="branch.active"
                   [attr.aria-label]="'Branch ' + branch.name + ' of ' + project.name + ' is active'"
                   [attr.data-testid]="branch.active ? 'branch-deactivate' : 'branch-activate'"
                   (change)="toggle(branch, $event)"/>
          </li>
        } @empty {
          <li class="px-5 py-4 text-sm text-base-content/70" data-testid="project-no-branches">No branches to show.</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCard {
  readonly project = input.required<IProject>()
  readonly switchBranch = output<BranchSwitch>()

  summary(): string {
    const branches = this.project().branches
    const inactive = branches.filter((b) => !b.active).length
    const count = `${branches.length} ${branches.length === 1 ? 'branch' : 'branches'}`
    return inactive > 0 ? `${count} · ${inactive} inactive` : count
  }

  toggle(branch: IBranch, event: Event): void {
    // the store decides: show the old state until the API has answered
    (event.target as HTMLInputElement).checked = branch.active
    this.switchBranch.emit({branchId: branch.id, active: !branch.active})
  }
}

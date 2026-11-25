import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core'
import {IBuildStats} from '../../core'

/** The numbers Build Bruh knows about, as four cards. */
@Component({
  selector: 'bb-stat-cards',
  template: `
    <div class="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-4" data-testid="stats-hero">
      @for (card of cards(); track card.key) {
        <div class="card bg-base-100 border border-base-300 shadow-sm" attr.data-testid="stat-{{card.key}}">
          <div class="card-body gap-3 p-5">
            <span class="size-10 rounded-xl grid place-items-center" [class]="card.tone" aria-hidden="true">
              <span class="material-icons text-[20px]">{{ card.icon }}</span>
            </span>
            <div>
              <div class="font-display text-3xl font-extrabold">{{ card.value }}</div>
              <div class="text-base-content/70">{{ card.label }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCards {
  readonly stats = input.required<IBuildStats>()

  readonly cards = computed(() => {
    const stats = this.stats()
    return [
      {key: 'projects', label: 'Projects', value: stats.numberOfProjects, icon: 'folder', tone: 'bg-primary/10 text-primary'},
      {key: 'branches', label: 'Branches', value: stats.numberOfBranches, icon: 'call_split', tone: 'bg-accent/10 text-accent'},
      {key: 'builds', label: 'Builds', value: stats.numberOfBuilds, icon: 'inventory_2', tone: 'bg-success/10 text-success'},
      {key: 'labels', label: 'Labels', value: stats.numberOfLabels, icon: 'sell', tone: 'bg-warning/10 text-warning'}
    ]
  })
}

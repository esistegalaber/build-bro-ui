import {ChangeDetectionStrategy, Component, input} from '@angular/core'
import {ILabelViolation} from '../../core'
import {EmptyState} from '../../ui/empty-state'

/** Stored labels that don't fit their definition: one row per key and value (or per key, for the wrong entity). */
@Component({
  selector: 'bb-label-violations-table',
  template: `
    @if (violations().length > 0) {
      <div class="overflow-x-auto">
        <table class="table table-sm" data-testid="label-violations">
          <thead>
          <tr>
            @if (showKey()) {
              <th scope="col">Label</th>
            }
            <th scope="col">Value</th>
            <th scope="col">On</th>
            <th scope="col">Problem</th>
            <th scope="col" class="text-right">Count</th>
          </tr>
          </thead>
          <tbody>
            @for (violation of violations(); track violation.key + violation.target + violation.value) {
              <tr data-testid="label-violation">
                @if (showKey()) {
                  <td class="font-medium">{{ violation.key }}</td>
                }
                <td class="font-mono break-words">{{ violation.value ?? '–' }}</td>
                <td>{{ violation.target === 'BUILD' ? 'builds' : 'deployments' }}</td>
                <td>{{ violation.reason === 'WRONG_TARGET' ? 'not meant for ' + (violation.target === 'BUILD' ? 'builds' : 'deployments') : 'value not allowed' }}</td>
                <td class="text-right font-mono">{{ violation.count }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <bb-empty-state icon="task_alt" compact data-testid="label-violations-none">
        <p>{{ emptyText() }}</p>
      </bb-empty-state>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyState]
})
export class LabelViolationsTable {
  readonly violations = input.required<ILabelViolation[]>()
  readonly emptyText = input('All stored labels fit their definitions.')
  /** Off where all rows are about the same key, e.g. in the definition form */
  readonly showKey = input(true)
}

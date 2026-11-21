import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {CloningPipe, IBuild} from '../../core'
import {BuildId} from "./build.id";
import {SortedLabelsPipe} from "../../core/pipes/sort-label.pipe";

@Component({
  selector: 'bb-builds-accordion',
  template: `
      @for (build of builds; track build.id) {
        <div class="collapse collapse-arrow border border-base-content/20 rounded-box">
          <input type="checkbox" class="peer" attr.data-cy-id="build-{{build.id}}"/>
          <div class="collapse-title">
            <bb-build-id [build]="build"></bb-build-id>
          </div>
          <div class="collapse-content">
            <table class="table ">
              <tr>
                <td>Build Bro ID:</td>
                <td>{{build.id}}</td>
              </tr>
              @for (label of build.labels | deepClone | sortedLabels; track label.id) {
                <tr>
                  <td>{{label.key}}</td>
                  <td>{{label.value}}</td>
                </tr>
              }
            </table>
          </div>
        </div>
      }
  `,
  imports: [BuildId, SortedLabelsPipe, CloningPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}

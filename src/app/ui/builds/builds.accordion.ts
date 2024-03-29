import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {CloningPipe, IBuild} from '../../core'
import {CommonModule} from "@angular/common";
import {BuildId} from "./build.id";
import {SortedLabelsPipe} from "../../core/pipes/sort-label.pipe";

@Component({
  selector: 'bb-builds-accordion',
  template: `
      <div class="collapse collapse-arrow border rounded-box" *ngFor="let build of builds">
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
                  <tr *ngFor="let label of build.labels | deepClone | sortedLabels">
                      <td>{{label.key}}</td>
                      <td>{{label.value}}</td>
                  </tr>
              </table>
          </div>
      </div>
  `,
  standalone: true,
  imports: [CommonModule, BuildId, SortedLabelsPipe, CloningPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}

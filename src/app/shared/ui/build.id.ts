import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from "../../core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'bb-build-id',
  template: `
    <span>{{build.project}}::{{build.branch}}::{{build.buildNumber}}</span>
  `,
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildId {
  @Input()
  build!: IBuild
}

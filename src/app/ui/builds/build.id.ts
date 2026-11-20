import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from "../../core";

@Component({
  selector: 'bb-build-id',
  template: `
      <strong class="m-2">{{build.project}} :: {{build.branch}} :: {{build.buildNumber}}</strong>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildId {
  @Input()
  build!: IBuild
}

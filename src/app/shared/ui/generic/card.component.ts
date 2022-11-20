import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
  selector: 'bz-card',
  template: `
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">{{title}}</h6>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input()
  title = ''
}

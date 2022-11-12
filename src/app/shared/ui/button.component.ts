import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'bz-button',
  template: `
    <button class="btn rounded-3" [ngClass]="css" (click)="click.emit()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input()
  css = ''

  @Output()
  click = new EventEmitter<void>()
}

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'bb-button',
  template: `
    <button mat-button [ngClass]="css" (click)="click.emit()">
      <ng-content></ng-content>
    </button>
  `,
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class ButtonComponent {
  @Input()
  css = ''

  @Output()
  click = new EventEmitter<void>()
}

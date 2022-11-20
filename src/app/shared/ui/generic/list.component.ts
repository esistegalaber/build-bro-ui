import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'bb-list',
  template: `
    <mat-action-list>
      <button mat-list-item *ngFor="let datum of data" (click)="selected.emit(datum)">{{datum}}</button>
    </mat-action-list>
  `,
  standalone: true,
  imports: [CommonModule, MatListModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input()
  data!: string[]
  @Output()
  selected = new EventEmitter<string>()

}

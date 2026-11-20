import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IAlert} from '../core'
import {CommonModule} from "@angular/common";

@Component({
  selector: 'bz-alert-panel',
  template: `
    @if (alert.message.length>0) {
      <div class="alert shadow-lg m-2" [ngClass]="alert.type" data-cy-id="alert">
        <div>
          <span class="material-icons">close</span>
          <div>
            <h3 class="font-bold">{{alert.heading}}</h3>
            <div class="text-xs">{{alert.message}}</div>
          </div>
        </div>
        <div class="flex-none">
          <button class="btn btn-sm" (click)="clearAlert.emit()" data-cy-id="alert-ok">OK</button>
        </div>
      </div>
    }
    <!--      <div [class]="'alert alert-dismissible alert-'+ alert.type" role="alert">-->
    <!--        <h5 class="alert-heading" [innerHTML]="alert.heading">_</h5>-->
    <!--        <p [innerHTML]="alert.message">_</p>-->
    <!--        <button type="button" class="btn-close" (click)="clearAlert.emit()">-->
    <!--          <span aria-hidden="true">&times;</span>-->
    <!--        </button>-->
    <!--      </div>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class AlertPanel {
  @Input()
  alert!: IAlert
  @Output()
  clearAlert = new EventEmitter<void>()
}

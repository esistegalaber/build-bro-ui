import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IAlert} from '../core'
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'bz-alert-panel',
  template: `
    <ng-container *ngIf="alert.message.length>0">
      <div class="grid grid-cols-3">
        <div></div>
        <mat-card>
          <mat-card-header>
            {{alert.heading}}
          </mat-card-header>
          <mat-card-content>
            {{alert.message}}
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="clearAlert.emit()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
        <div></div>
      </div>
    </ng-container>
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
  imports: [
    CommonModule, MatSnackBarModule, MatCardModule, MatButtonModule, MatIconModule
  ]
})
export class AlertPanel {
  @Input()
  alert!: IAlert
  @Output()
  clearAlert = new EventEmitter<void>()
}

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterModule} from "@angular/router";
import {INavState, ISideNav} from "../../../core";

@Component({
  selector: 'bz-sidenav',
  template: `
    <mat-nav-list *ngIf="sideNav.visible" [ngClass]="{'w-48': sideNav.text}">
      <a mat-list-item [routerLink]="['builds']">
        <mat-icon>build</mat-icon>
        <span *ngIf="sideNav.text">&nbsp;Builds</span>
      </a>
      <a mat-list-item [routerLink]="['build-sets']">
        <mat-icon>construction</mat-icon>
        <span *ngIf="sideNav.text">&nbsp;Build Sets</span>
      </a>
    </mat-nav-list>
  `,
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavPanel {
  @Input()
  sideNav!: ISideNav
}

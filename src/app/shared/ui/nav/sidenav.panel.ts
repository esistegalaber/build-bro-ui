import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'bz-sidenav',
  template: `
    <mat-action-list>
      <button mat-list-item [routerLink]="['builds']">
        <mat-icon>build</mat-icon>
        Builds
      </button>
      <button mat-list-item [routerLink]="['build-sets']">
        <mat-icon>construction</mat-icon>
        Build Sets
      </button>
    </mat-action-list>
  `,
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavPanel {

}

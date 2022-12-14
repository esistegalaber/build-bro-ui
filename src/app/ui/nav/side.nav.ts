import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ISideNav} from "../../core";

@Component({
  selector: 'bz-sidenav',
  template: `
      <nav class="shrink">
          <ul class="menu bg-base-100 p-2 rounded-box" [ngClass]="{'w-48': sideNav.text}">
            <li>
              <a routerLink="build-sets">
                <span class="material-icons">construction</span>
                <span *ngIf="sideNav.text">&nbsp;Build Sets</span>
              </a>
            </li>
            <li>
            <a routerLink="builds">
            <span class="material-icons">build</span>
            <span *ngIf="sideNav.text">&nbsp;Builds</span>
            </a>
            </li>
              <li>
                  <a routerLink="servers">
                      <span class="material-icons">computer</span>
                      <span *ngIf="sideNav.text">&nbsp;Servers</span>
                  </a>
              </li>
              <li>
                  <a routerLink="deployments">
                      <span class="material-icons">agriculture</span>
                      <span *ngIf="sideNav.text">&nbsp;Deployments</span>
                  </a>
              </li>
              <li>
                  <a routerLink="projects">
                      <span class="material-icons">factory</span>
                      <span *ngIf="sideNav.text">&nbsp;Projects</span>
                  </a>
              </li>
          </ul>
      </nav>

  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNav {
  @Input()
  sideNav!: ISideNav
}

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
            <a routerLink="build-sets" data-cy-id="nav-build-sets">
              <span class="material-icons">construction</span>
              @if (sideNav.text) {
                <span>&nbsp;Build Sets</span>
              }
            </a>
          </li>
          <li>
            <a routerLink="builds" data-cy-id="nav-builds">
              <span class="material-icons">build</span>
              @if (sideNav.text) {
                <span>&nbsp;Builds</span>
              }
            </a>
          </li>
          <li>
            <a routerLink="servers" data-cy-id="nav-servers">
              <span class="material-icons">computer</span>
              @if (sideNav.text) {
                <span>&nbsp;Servers</span>
              }
            </a>
          </li>
          <li>
            <a routerLink="deployments" data-cy-id="nav-deployments">
              <span class="material-icons">agriculture</span>
              @if (sideNav.text) {
                <span>&nbsp;Deployments</span>
              }
            </a>
          </li>
          <li>
            <a routerLink="projects" data-cy-id="nav-projects">
              <span class="material-icons">factory</span>
              @if (sideNav.text) {
                <span>&nbsp;Projects</span>
              }
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

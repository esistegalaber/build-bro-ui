import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'bz-sidenav',
  template: `
    <div class="container-fluid">
      <nav class="nav flex-column">
        <a class="nav-item nav-link" [routerLink]="['/builds']" [routerLinkActive]="'active'">
          <fa-icon icon="screwdriver-wrench" size="xl"></fa-icon>
        </a>
        <a class="nav-item nav-link" [routerLink]="['/build-sets']" [routerLinkActive]="'active'">
          <fa-icon icon="unsorted" size="xl"></fa-icon>
        </a>
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavPanel {

}

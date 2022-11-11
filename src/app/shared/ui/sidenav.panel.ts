import {Component} from "@angular/core";

@Component({
  selector: 'bz-sidenav',
  template: `
    <div class="container-fluid">
      <nav class="nav flex-column">
        <a class="nav-item nav-link" [routerLink]="['/builds']" [routerLinkActive]="'active'">Builds</a>
        <a class="nav-item nav-link" [routerLink]="['/build-sets']" [routerLinkActive]="'active'">BuildSets</a>
        <a class="nav-item nav-link" href="#">Deployments</a>
        <a class="nav-item nav-link" href="#">Admin</a>
      </nav>
    </div>
  `
})
export class SidenavPanel {

}

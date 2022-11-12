import {NgModule} from "@angular/core";
import {CoreModule} from "../core/core.module";
import {FormsModule} from "@angular/forms";
import {BuildIdentifierPanel} from "./ui/build-identifier.panel";
import {AlertPanel} from "./ui/alert.panel";
import {Navbar} from "./ui/navbar";
import {SidenavPanel} from "./ui/sidenav.panel";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CommonModule} from "@angular/common";
import {BuildsAccordion} from "./ui/builds.accordion";
import {PaginationPanel} from "./ui/pagination.panel";
import {ButtonComponent} from "./ui/button.component";

const reExports = [
  CommonModule,
  CoreModule,
  FormsModule,
  RouterModule,
  NgbModule,
  FontAwesomeModule,
]

const declarations = [
  AlertPanel,
  Navbar,
  SidenavPanel,
  BuildIdentifierPanel,
  BuildsAccordion,
  ButtonComponent,
  PaginationPanel
]

@NgModule({
  imports: [
    ...reExports
  ],
  declarations: [
    ...declarations
  ],
  exports: [
    CommonModule,
    ...reExports,
    ...declarations
  ]
})
export class SharedModule {
}

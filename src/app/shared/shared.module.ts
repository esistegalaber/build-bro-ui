import {NgModule} from "@angular/core";
import {CoreModule} from "../core/core.module";
import {FormsModule} from "@angular/forms";
import {AlertPanel} from "./ui/alert.panel";
import {SidenavPanel} from "./ui/nav/sidenav.panel";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BuildsAccordion} from "./ui/builds.accordion";
import {ButtonComponent} from "./ui/generic/button.component";
import {BuildSetTemplateList} from "./ui/build-set-template.list";
import {CardComponent} from "./ui/generic/card.component";
import {BuildBroToolbar} from "./ui/nav/build-bro.toolbar";
import {BuildId} from "./ui/build.id";
import {ListComponent} from "./ui/generic/list.component";

const reExports = [
  CommonModule,
  CoreModule,
  FormsModule,
  RouterModule,
  BuildBroToolbar,
  SidenavPanel,
  BuildId,
  BuildsAccordion,
  ButtonComponent,
  CardComponent,
  ListComponent
]

const declarations = [
  AlertPanel,
  BuildSetTemplateList
]

@NgModule({
  imports: [
    ...reExports,
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

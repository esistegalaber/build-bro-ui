import {NgModule} from "@angular/core";
import {CoreModule} from "../core/core.module";
import {FormsModule} from "@angular/forms";
import {AlertPanel} from "./ui/alert.panel";
import {SidenavPanel} from "./ui/nav/sidenav.panel";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BuildsAccordion} from "./ui/builds/builds.accordion";
import {ButtonComponent} from "./ui/generic/button.component";
import {BuildSetTemplateList} from "./ui/build-set-template.list";
import {CardComponent} from "./ui/generic/card.component";
import {BuildBroToolbar} from "./ui/nav/build-bro.toolbar";
import {BuildId} from "./ui/builds/build.id";
import {ListComponent} from "./ui/generic/list.component";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {BuildSetTemplateForm} from "./ui/build-sets/build-set-template.form";
import {BuildDataTree} from "./ui/builds/build-data.tree";
import {ProjectSelector} from "./ui/build-sets/project.selector";
import {BuildTemplateForm} from "./ui/build-sets/build-template.form";

const reExports = [
  CommonModule,
  CoreModule,
  FormsModule,
  RouterModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatStepperModule,
  BuildBroToolbar,
  SidenavPanel,
  BuildId,
  BuildsAccordion,
  BuildDataTree,
  ButtonComponent,
  CardComponent,
  ListComponent,
  BuildSetTemplateForm,
  ProjectSelector,
  BuildTemplateForm
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

import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {HomePage} from "./home.page";
import {StatsPanel} from "./ui/stats.panel";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '', component: HomePage
    }])
  ],
  declarations: [
    HomePage,
    StatsPanel
  ]
})
export class HomeModule {
}

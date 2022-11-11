import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BuildSetsPage} from "./ui/build-sets.page";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'builds', loadChildren: () => import('./builds/builds.module').then((m) => m.BuildsModule)},
  {path: 'build-sets', component: BuildSetsPage}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

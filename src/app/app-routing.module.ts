import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'builds', loadChildren: () => import('./builds/builds.module').then((m) => m.BuildsModule)},
  {path: 'build-sets', loadChildren: () => import('./build-sets/build-sets.module').then((m) => m.BuildSetsModule)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

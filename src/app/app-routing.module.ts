import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.routes').then((m) => m.routes)},
  {path: 'builds', loadChildren: () => import('./builds/builds.routes').then(r => r.routes)},
  {path: 'build-sets', loadChildren: () => import('./build-sets/build-sets.routes').then((r) => r.routes)},
  {path: 'new-build-set', loadChildren: () => import('./build-set-edit/edit-build-set.routes').then((m) => m.routes)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

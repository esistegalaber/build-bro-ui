import {Routes} from '@angular/router';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.routes').then((m) => m.homeRoutes)},
  {path: 'builds', loadChildren: () => import('./builds/builds.routes').then(r => r.buildsRoutes)},
  {path: 'build-sets', loadChildren: () => import('./build-sets/build-sets.routes').then((r) => r.buildSetRoutes)},
  {path: 'edit-build-set', loadChildren: () => import('./build-set-edit/edit-build-set.routes').then((m) => m.editBuildSetRoutes)}
];

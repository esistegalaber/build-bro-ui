import {Routes} from '@angular/router';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.routes').then((routes) => routes.homeRoutes)},
  {path: 'builds', loadChildren: () => import('./builds/builds.routes').then((routes) => routes.buildsRoutes)},
  {path: 'build-sets', loadChildren: () => import('./build-sets/build-sets.routes').then((routes) => routes.buildSetRoutes)},
  {path: 'edit-build-set', loadChildren: () => import('./build-set-edit/edit-build-set.routes').then((routes) => routes.editBuildSetRoutes)},
  {path: 'projects', loadChildren: () => import('./projects/projects.routes').then((routes) => routes.projectsRoutes)},
  {path: 'servers', loadChildren: () => import('./servers/servers.routes').then((routes) => routes.serversRoutes)},
  {path: 'deployments', loadChildren: () => import('./deployments/deployment.routes').then((routes) => routes.deploymentRoutes)}
];

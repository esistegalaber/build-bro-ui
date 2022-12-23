import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import * as ProjectActions from "./project.actions";
import {catchError, map, switchMap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Buildz, IBranch, IProject} from "../model";
import {of} from "rxjs";
import * as AlertActions from "../alerts/alert.actions";

@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.loadProjects, ProjectActions.toggleInactiveProjectsVisible),
    switchMap(() => this.http.get<IProject[]>(`/api/v1/projects`).pipe(
        map((projects: IProject[]) => ProjectActions.projectsLoaded({projects})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))
  activateProject$ = createEffect(() => this.actions$.pipe(
      ofType(ProjectActions.activateProject),
      switchMap((action) => this.http.post<IProject>(`/api/v1/projects/active/${action.projectId}`, {}).pipe(
          map((project) => ProjectActions.projectUpdated({project})),
          catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
        )
      )
    )
  )


  deActivateProject$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.deactivateProject),
    switchMap((action) => this.http.post<IProject>(`/api/v1/projects/inactive/${action.projectId}`, {}).pipe(
        map((project) => ProjectActions.projectUpdated({project})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))

  activateBranch$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.activateBranch),
    switchMap((action) => this.http.post<IBranch>(`/api/v1/projects/branch-active/${action.branchId}`, null).pipe(
        map((branch) => ProjectActions.branchUpdated({branch})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))
  deActivateBranch$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.deactivateBranch),
    switchMap((action) => this.http.post<IBranch>(`/api/v1/projects/branch-inactive/${action.branchId}`, null).pipe(
        map((branch) => ProjectActions.branchUpdated({branch})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>) {
  }
}

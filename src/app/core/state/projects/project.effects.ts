import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import * as ProjectActions from "./project.actions";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {includeInactiveProjects} from "./project.selectors";
import {Buildz, IProject} from "../model";
import {of} from "rxjs";
import * as AlertActions from "../alerts/alert.actions";

@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.loadProjects, ProjectActions.toggleInactiveProjectsVisible),
    withLatestFrom(this.store.pipe(select(includeInactiveProjects))),
    switchMap(([action, includingInactive]) => this.http.get<IProject[]>(`/api/v1/projects/?include-inactive=${includingInactive}`).pipe(
        map((projects: IProject[]) => ProjectActions.projectsLoaded({projects})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>) {
  }
}

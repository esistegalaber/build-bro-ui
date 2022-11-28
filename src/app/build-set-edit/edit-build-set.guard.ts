import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {Buildz, IBuildSet, IBuildSetTemplate} from "../core";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {buildSetLoaded, buildSetTemplateLoaded} from "./state/edit-build-sets.actions";
import {backendErrorOccurred} from "../core/state/alerts/alert.actions";
import {Injectable} from "@angular/core";

@Injectable()
export class EditBuildSetGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.http.get<IBuildSetTemplate>(`/api/v1/build-sets/${route.params['build-set-name']}`).pipe(
      map((theTemplate) => this.store.dispatch(buildSetTemplateLoaded({theTemplate}))),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse}))),
      map(() => true)
    )
  }


  constructor(private store: Store<Buildz>, private http: HttpClient) {
  }
}

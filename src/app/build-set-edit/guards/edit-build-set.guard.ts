import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import {HttpClient} from "@angular/common/http";
import * as BuildSetActions from "../state/edit-build-sets.actions";
import {Injectable} from "@angular/core";

@Injectable()
export class EditBuildSetGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const buildSetName = route.params['build-set-name']
    if (!!buildSetName) {
      this.store.dispatch(BuildSetActions.loadBuildSetTemplate({name: buildSetName}))
    }
    return true;
  }


  constructor(private store: Store<Buildz>, private http: HttpClient) {
  }
}

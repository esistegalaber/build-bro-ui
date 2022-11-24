// The Alert actions
import {createAction, props} from "@ngrx/store";
import {IAlertMessage} from "../model";
import {HttpErrorResponse} from "@angular/common/http";

export const toggleSideNavState = createAction('[NAV]] Toggle')

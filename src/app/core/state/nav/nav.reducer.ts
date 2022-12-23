// Initial Alert state
import {INavState} from "../model";
import {createReducer, on} from "@ngrx/store";
import {toggleSideNavState} from "./nav.actions";

export const INITIAL_NAV_STATE: INavState = {
  sidenav: {
    text: false
  }
}
// The Reducer
export const navReducer = createReducer(
  INITIAL_NAV_STATE,
  on(toggleSideNavState, (state: INavState) => {
    return {...state, sidenav: {text: !state.sidenav.text}}
  })
)

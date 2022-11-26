import {createSelector} from "@ngrx/store";
import {theProjectsState} from "../selectors";
import {ProjectsState} from "../model";

export const includeInactiveProjects = createSelector(
  theProjectsState, (state: ProjectsState): boolean => state.includeInactiveProjects
)

export interface Buildz {
  projects: ProjectsState
  servers: ServersState
  stats: IBuildStats
  nav: INavState
}

// Base interfaces
/**
 * An interface that includes all
 * information that every "Search Result"
 * object should have
 */
export interface IBaseSearchResult {
  page: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * An interface that includes all
 * information that should be included
 * in every "Search Parameters" object
 */
export interface IBaseSearchParams {
  pageSize: number
  page: number
  sortAttribute: string
  sortDirection: string
}

// Build related interfaces
export interface IBuildsState {
  search: IBuildSearchParams
  result: IBuildSearchResult
  available: ISearchData
}

export interface ISearchData {
  projectNames: string[];
  projectBranches: { [key: string]: string[] }
  labelKeys: string[];
}

export interface IBuildSearchParams extends IBaseSearchParams {
  project: string
  branch: string
  minBuildNumber: string | null
  maxBuildNumber: string | null
  labels: { [key: string]: string }

}

export interface IBuildSearchResult extends IBaseSearchResult {
  data: IBuild[]
}

export interface IBuildLabel {
  id: number
  key: string
  value: string
}

export interface IPaginationParams {
  totalElements: number
  totalPages: number
  pageSize: number
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface IBuild {
  id: number
  project: string
  branch: string
  buildNumber: number
  labels: IBuildLabel[]
}

export interface IBuildDataTreeNode {
  build?: IBuild
  label?: IBuildLabel
  children: IBuildDataTreeNode[]
  name: string
}

export interface ProjectsState {
  includeInactiveProjects: boolean
  projects: IProject[]
}

export interface IProject {
  id: number
  name: string
  active: boolean
  branches: IBranch[]
}

export interface IBranch {
  id: number
  name: string
  active: boolean
  projectId: number
}

export interface IProjectBranch {
  projectName: string
  branchName: string
  active: boolean
}

export interface IProjectsResponse {
  projects: IProject[]
  projectBranches: { [key: string]: IBranch[] }
  labelKeys: string[]
}

export interface IProjectWithBranches {
  project: IProject
  branches: IBranch[]
}

export interface ISelectedProjectAndBranch {
  project: IProject
  branch: IBranch
}

export interface IBuildStats {
  numberOfBuilds: number
  numberOfLabels: number
  numberOfDeploys: number
  numberOfProjects: number
  numberOfBranches: number
}

export interface IBuildSetState {
  names: string[]
  currentBuildSetName: string
  currentTemplate: IBuildSetTemplate
  buildSet: IBuildSet
}

export interface IBuildSetTemplate {
  id?: number | null
  name: string
  buildTemplates: IBuildTemplate[]
}

export interface IBuildTemplate {
  id?: number,
  project: string
  branch: string | null,
  labels: { [key: string]: string }
  buildNumber: number | null
}

export interface IBuildSet {
  name: string
  builds: { [key: string]: IBuild }
}

export interface IAlert {
  type: string
  heading: string
  message: string
}

export interface IAlertMessage {
  heading: string
  message: string
}

// Interfaces related to Server(s)
/**
 * A State interface that represents all Server related State data
 */
export interface ServersState {
  servers: IServer[]
}

/**
 * A view interface that represents a specific Server
 */
export interface IServer {
  id: number
  name: string
  reservation?: IReservation
  nickName?: string
  description?: string
}

// Interfaces related to Reservation(s)
/**
 * A view interface that represents a specific Server Reservation
 */
export interface IReservation {
  by: string
  note: string
}


/**
 * An event interface that contains all data needed to reserve a server
 */
export interface ICreateReservationEvent {
  serverName: string
  reservation: {
    reservedBy: string
    reservationNote: string
  }
}

// Interfaces related to Deploy(s)
/**
 * A view interface that represents a specific Deploy
 */
export interface IDeployment {
  id: number
  deployedAt: string
  builds: IBuild[]
  labels: IDeploymentLabel[]
}

export interface IDeploymentLabel {
  id: number
  key: string
  value: string
}

/**
 * A view interface that represents a Build related to a Deploy
 */
export interface IDeployBuild {
  id: number
  project: string
  branch: string
  buildNumber: number
}

export interface IDeploymentSearch extends IBaseSearchParams {
  serverName: string
}

/**
 * A Search Result interface that encapsulates all info related
 * to the results of a Deploy search
 */
export interface IDeploymentSearchResult extends IBaseSearchResult {
  data: IDeployment[]
}

export interface INavState {
  sidenav: ISideNav
}

export interface ISideNav {
  text: boolean
}


/**
 * Defines the data needed to edit a BuildSetTemplate.
 */
export interface EditableBuildSetTemplate {
  id?: number
  name: string
  projects: IProject[]
  // buildTemplates: IBuildTemplate[]
}

/**
 * Defines the data needed to edit a BuildTemplate.
 */
export interface EditableBuildTemplate {
  id?: number,
  project: IProject
  projectSelected: boolean
  branch: IBranch | null
  labels: { [key: string]: string }
  buildNumber: number | null
}

export interface Buildz {
  projects: IProjects
  stats: IBuildStats
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
  minBuildNumber: number | null
  maxBuildNumber: number | null
  labels: any
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
  pageSize: number
  currentPage: number
}

export interface IBuild {
  id: number
  project: string
  branch: string
  buildNumber: number
  labels: IBuildLabel[]
}

export interface IProjects {
  projects: IProject[]
  projectBranches: { [key: string]: IBranch[] }
  labelKeys: string[]
  inactiveIncluded: boolean
  currentProject: IProject
  currentBranch: IBranch
}

export interface IProject {
  name: string
  active: boolean
}

export interface IBranch {
  name: string
  active: boolean
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

export interface IEnvironments {
  knownEnvironments: IEnvironment[]
  currentEnvironmentName: string
  currentEnvironment: IEnvironment
  environmentBuilds: IEnvironmentBuilds
}

export interface IEnvironment {
  id?: number
  name: string
  internal?: boolean
  artifacts: IArtifact[]
}

export interface IArtifact {
  id?: number,
  project: string,
  branch: string,
  labels: { [key: string]: string }
}

export interface IEnvironmentBuilds {
  environment: string
  internal: boolean
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
export interface IServersState {
  knownServers: IServer[]
  currentServer?: IServer
  deploysSearch?: IDeploySearch
  deploysResult?: IDeploySearchResult
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
export interface IDeploy {
  id: number
  deployedAt: Date
  build: IDeployBuild
  labels: any
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

export interface IDeploySearch extends IBaseSearchParams {
  serverName: string
}

/**
 * A Search Result interface that encapsulates all info related
 * to the results of a Deploy search
 */
export interface IDeploySearchResult extends IBaseSearchResult {
  deploys: IDeploy[]
}

import type {components} from '../api/build-bro-api'

// API models
// ----------
// The API DTOs come from the build-bro-api contract (api/build-bro-api.yaml), generated into
// core/api/build-bro-api.ts by `npm run api:types`. Never define them by hand here.
//
// The contract marks hardly any property as required, so the generated types are mostly optional. Until that is
// decided in the contract (see build-bro-ui#65), the UI keeps its earlier assumptions, stated below:
// every property is present (`Present`), except the ones listed with `WithOptional`, and a few may be `null`
// (`WithNull`), because the UI sends or keeps `null` there.

type Schemas = components['schemas']

/** Every property present (deeply), and not readonly: what the UI assumed of the API's responses so far. */
type Present<T> = T extends (infer U)[]
  ? Present<U>[]
  : T extends object
    ? { -readonly [K in keyof T]-?: Present<T[K]> }
    : T

/** Properties that may be missing. */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** Properties the UI sets to `null`, which the contract doesn't (yet) declare as nullable. */
type WithNull<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | null }

export type SortDirection = Schemas['SortDirection']

export type ISearchData = Omit<Present<Schemas['ISearchData']>, 'labelDefinitions'> & { labelDefinitions: ILabelDefinition[] }
export type IBuildLabel = Present<Schemas['IBuildLabel']>
export type IBuild = Present<Schemas['IBuild']>
export type IBuildSearchParams = WithNull<Present<Schemas['IBuildSearch']>, 'minBuildNumber' | 'maxBuildNumber'>
export type IBuildSearchResult = Present<Schemas['IBuildSearchResult']>
export type IProject = Present<Schemas['IProject']>
export type IBranch = Present<Schemas['IBranch']>
export type IBuildStats = Present<Schemas['IBuildBroStats']>
export type IBuildTemplate = WithOptional<WithNull<Present<Schemas['IBuildTemplate']>, 'branch' | 'buildNumber'>, 'id'>
export type IBuildSetTemplate = WithOptional<
  WithNull<Omit<Present<Schemas['IBuildSetTemplate']>, 'buildTemplates'> & { buildTemplates: IBuildTemplate[] }, 'id'>,
  'id'>
export type IBuildSet = Present<Schemas['IBuildSet']>
/** `reservation` is UI-only: the API has no reservations (yet). */
export type IServer = WithOptional<Present<Schemas['IServer']>, 'nickName' | 'description'> & { reservation?: IReservation }
export type IDeployment = Present<Schemas['IDeployment']>
export type IDeploymentLabel = Present<Schemas['IDeploymentLabel']>
export type IDeploymentSearch = Present<Schemas['IDeploymentSearch']>
export type IDeploymentSearchResult = Present<Schemas['IDeploymentSearchResult']>
/** The optional parts of a definition may be missing, and the API sends them as `null`. */
type LabelDefinitionOptionals = 'displayName' | 'description' | 'pattern' | 'style'
export type ILabelDefinition = WithOptional<WithNull<Present<Schemas['ILabelDefinition']>, LabelDefinitionOptionals>, LabelDefinitionOptionals>
export type LabelType = Schemas['LabelType']
export type LabelStyle = Schemas['LabelStyle']

/** Paging fields of every search result. */
export type IBaseSearchResult = Omit<IBuildSearchResult, 'data'>
/** Paging and sorting fields of every search request. */
export type IBaseSearchParams = Pick<IBuildSearchParams, 'pageSize' | 'page' | 'sortAttribute' | 'sortDirection'>
/** A build as part of a deployment, without its labels. */
export type IDeployBuild = Omit<IBuild, 'labels'>

// UI state and view models
// ------------------------

export interface Buildz {
  projects: ProjectsState
  servers: ServersState
  labels: LabelsState
  stats: IBuildStats
  nav: INavState
}

export interface IBuildsState {
  search: IBuildSearchParams
  result: IBuildSearchResult
  available: ISearchData
}

export interface IPaginationParams {
  totalElements: number
  totalPages: number
  pageSize: number
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
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

export interface IBuildSetState {
  names: string[]
  currentBuildSetName: string
  currentTemplate: IBuildSetTemplate
  buildSet: IBuildSet
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

/** The label definitions (build-bro-api#7), for showing labels by their type and style. */
export interface LabelsState {
  definitions: ILabelDefinition[]
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

import {alertState, theBuildStats, theSideNavState} from './selectors'
import {Buildz} from './model'
import {EMPTY_BUILD_STATS} from './stats/stats.state'

describe('core selectors', () => {
  const state = {
    alert: {type: 'alert-info', heading: 'Saved', message: 'ok'},
    stats: EMPTY_BUILD_STATS,
    nav: {sidenav: {text: true}},
    projects: {includeInactiveProjects: false, projects: []},
    servers: {servers: []},
    labels: {definitions: []}
  }

  it('select the alert', () => {
    expect(alertState(state)).toBe(state.alert)
  })

  it('select the build stats', () => {
    expect(theBuildStats(state as Buildz)).toBe(EMPTY_BUILD_STATS)
  })

  it('select the side nav state', () => {
    expect(theSideNavState(state as Buildz)).toEqual({text: true})
  })
})

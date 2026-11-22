import {INITIAL_NAV_STATE, navReducer} from './nav.reducer'
import {toggleSideNavState} from './nav.actions'

describe('navReducer', () => {
  it('shows the side nav labels initially', () => {
    expect(navReducer(undefined, {type: '@@init'})).toEqual({sidenav: {text: true}})
  })

  it('toggles the labels', () => {
    const collapsed = navReducer(INITIAL_NAV_STATE, toggleSideNavState())
    expect(collapsed.sidenav.text).toBe(false)
    expect(navReducer(collapsed, toggleSideNavState()).sidenav.text).toBe(true)
  })

  it('does not mutate the previous state', () => {
    const before = structuredClone(INITIAL_NAV_STATE)
    navReducer(INITIAL_NAV_STATE, toggleSideNavState())
    expect(INITIAL_NAV_STATE).toEqual(before)
  })
})

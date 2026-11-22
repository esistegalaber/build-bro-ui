import {INITIAL_SERVERS_STATE, serversReducer} from './server.reducer'
import {allServers} from './server.selectors'
import * as ServerActions from './server.actions'
import {someServers} from '../../../../testing/data'

describe('serversReducer', () => {
  it('starts without servers', () => {
    expect(serversReducer(undefined, {type: '@@init'})).toEqual({servers: []})
  })

  it('takes the loaded servers', () => {
    const servers = someServers()
    expect(serversReducer(INITIAL_SERVERS_STATE, ServerActions.serversLoaded({servers})).servers).toEqual(servers)
  })

  it('replaces only the updated server', () => {
    const state = {servers: someServers()}
    const updated = {...state.servers[0], nickName: 'Renamed'}
    const next = serversReducer(state, ServerActions.serverUpdated({server: updated}))
    expect(next.servers[0]).toEqual(updated)
    expect(next.servers[1]).toBe(state.servers[1])
    expect(state.servers[0].nickName).toBe('Tester')
  })
})

describe('server selectors', () => {
  it('select all servers', () => {
    const servers = someServers()
    expect(allServers.projector({servers})).toBe(servers)
  })
})

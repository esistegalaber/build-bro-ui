import {buildStatsLoaded, EMPTY_BUILD_STATS, statsReducer} from './stats.state'

describe('statsReducer', () => {
  it('starts with zero everywhere', () => {
    expect(statsReducer(undefined, {type: '@@init'})).toEqual(EMPTY_BUILD_STATS)
  })

  it('takes the loaded stats', () => {
    const stats = {numberOfProjects: 4, numberOfBranches: 14, numberOfBuilds: 90, numberOfLabels: 273, numberOfDeploys: 0}
    expect(statsReducer(EMPTY_BUILD_STATS, buildStatsLoaded({stats}))).toEqual(stats)
  })
})

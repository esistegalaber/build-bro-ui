import {filterProjects} from './projects.filter'
import {someProjects} from '../../testing/data'

describe('filterProjects', () => {
  const names = (search: string) => filterProjects(someProjects(), search)
    .map((p) => `${p.name}: ${p.branches.map((b) => b.name).join(',')}`)

  it('keeps everything for an empty search', () => {
    const projects = someProjects()
    expect(filterProjects(projects, '  ')).toBe(projects)
  })

  it('keeps all branches of a project whose name matches', () => {
    expect(names('BACK')).toEqual(['backend: main,next,merged-feature'])
  })

  it('keeps only the matching branches of other projects', () => {
    expect(names('main')).toEqual(['backend: main', 'frontend: main', 'abandoned: main'])
    expect(names('merged')).toEqual(['backend: merged-feature'])
  })

  it('drops projects without a match', () => {
    expect(names('nothing')).toEqual([])
  })
})

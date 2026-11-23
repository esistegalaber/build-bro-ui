// Expects the API on :8080 with testdata.sql loaded.
describe('Home Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', url: '/api/v1/stats'}).as('stats')
    cy.intercept({method: 'POST', url: '/api/v1/deployments/search'}).as('deployments')
    cy.intercept({method: 'GET', pathname: '/api/v1/build-sets'}).as('build-sets')
    cy.visit('/')
    cy.wait(['@stats', '@deployments', '@build-sets'])
  })

  it('Shows the stats', () => {
    cy.get('[data-cy-id=stats-hero]').should('be.visible')
    cy.get('[data-cy-id=stat-projects]').should('contain.text', '4').and('contain.text', 'Projects')
    cy.get('[data-cy-id=stat-branches]').should('contain.text', '14')
    cy.get('[data-cy-id=stat-builds]').should('contain.text', '90')
    cy.get('[data-cy-id=stat-labels]').should('contain.text', '273')
  })

  it('Shows the three newest deployments', () => {
    cy.get('@deployments').its('request.body').should('deep.include', {page: 0, pageSize: 3, sortDirection: 'DESC'})
    cy.get('[data-cy-id^=home-deployment-]').should('have.length', 3)
    cy.get('[data-cy-id=home-deployment-1]').should('contain.text', 'testserver · Tester').and('contain.text', 'backend #10')
    cy.get('[data-cy-id=home-all-deployments]').click()
    cy.location('pathname').should('eq', '/deployments')
  })

  it('Lists the build sets and links to them', () => {
    cy.get('[data-cy-id="home-build-set-main"]').should('contain.text', '2 projects · 1 pinned').click()
    cy.location('pathname').should('eq', '/edit-build-set/main')
    cy.go('back')
    cy.get('[data-cy-id=home-new-build-set]').click()
    cy.location('pathname').should('eq', '/edit-build-set/new')
  })

  it('Leads to the builds', () => {
    cy.get('[data-cy-id=browse-builds]').click()
    cy.location('pathname').should('eq', '/builds')
  })
})

// Expects the API on :8080 with testdata.sql loaded: active projects backend, backoffice, frontend
// and the inactive project 'abandoned'. Branch 2 is backend/next, branch 4 is the inactive backend/merged-feature-backend.
// The branch test restores the original state, so the suite can be re-run against the same data.
describe('Projects Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', url: '/api/v1/projects'}).as('projects')
    cy.visit('/projects')
    cy.wait('@projects')
  })

  it('Lists the active projects and branches only', () => {
    cy.get('[data-cy-id=project-backend]').should('exist')
    cy.get('[data-cy-id=project-backoffice]').should('exist')
    cy.get('[data-cy-id=project-frontend]').should('exist')
    cy.get('[data-cy-id=project-abandoned]').should('not.exist')
    cy.get('[data-cy-id=branch-2]').should('contain.text', 'next')
    cy.get('[data-cy-id=branch-4]').should('not.exist')
  })

  it('Includes inactive projects and branches when toggled', () => {
    cy.get('[data-cy-id=inactive-toggle]').click().should('be.checked')
    cy.get('[data-cy-id=project-abandoned]').should('exist')
    cy.get('[data-cy-id=branch-4]').should('contain.text', 'merged-feature-backend')
      .find('[data-cy-id=branch-activate]').should('exist')

    cy.get('[data-cy-id=inactive-toggle]').click().should('not.be.checked')
    cy.get('[data-cy-id=project-abandoned]').should('not.exist')
  })

  it('Deactivates and re-activates a branch', () => {
    cy.get('[data-cy-id=inactive-toggle]').click()

    cy.intercept({method: 'POST', url: '/api/v1/projects/branch-inactive/2'}).as('deactivate')
    cy.get('[data-cy-id=branch-2] [data-cy-id=branch-deactivate]').click()
    cy.wait('@deactivate').its('response.body').should('deep.include', {id: 2, active: false})
    cy.get('[data-cy-id=branch-2] [data-cy-id=branch-activate]').should('exist')

    cy.intercept({method: 'POST', url: '/api/v1/projects/branch-active/2'}).as('activate')
    cy.get('[data-cy-id=branch-2] [data-cy-id=branch-activate]').click()
    cy.wait('@activate').its('response.body').should('deep.include', {id: 2, active: true})
    cy.get('[data-cy-id=branch-2] [data-cy-id=branch-deactivate]').should('exist')
  })
})

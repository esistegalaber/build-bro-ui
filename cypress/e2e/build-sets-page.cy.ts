// Expects the API on :8080 with testdata.sql loaded (build set templates 'main',
// 'feature-test-stage-1' and 'Environment of StageServer').
describe('Build Sets Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/names'}).as('names')
    cy.visit('/build-sets')
    cy.wait('@names')
  })

  it('Lists the build set templates', () => {
    cy.get('[data-cy-id="build-set-name-main"]').should('be.visible')
    cy.get('[data-cy-id="build-set-name-feature-test-stage-1"]').should('be.visible')
    cy.get('[data-cy-id="build-set-name-Environment of StageServer"]').should('be.visible')
    cy.get('[data-cy-id=build-set-card]').should('not.exist')
  })

  it('Shows the builds of a selected build set', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/of/main'}).as('build-set')
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.wait('@build-set')
    cy.get('[data-cy-id="build-set-name-main"]').should('have.class', 'active')
    cy.get('[data-cy-id=build-set-card]')
      .should('contain.text', 'Builds of main')
      .within(() => {
        // latest backend/main build and latest frontend/main build
        cy.get('[data-cy-id=build-9]').should('exist')
        cy.get('[data-cy-id=build-40]').should('exist')
      })
  })

  it('Opens the edit and clone forms of a build set', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/of/main'}).as('build-set')
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.wait('@build-set')

    cy.get('[data-cy-id=build-set-edit]').click()
    cy.location('pathname').should('eq', '/edit-build-set/main')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', 'main')

    cy.go('back')
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.get('[data-cy-id=build-set-clone]').click()
    cy.location('pathname').should('eq', '/edit-build-set/clone/main')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', 'CLONE-OF-main')
  })

  it('Cancels the delete confirmation', () => {
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.get('[data-cy-id=build-set-delete]').click()
    cy.get('#delete-confirmation-dialog').should('be.checked')
    cy.get('[data-cy-id=delete-cancel]').click()
    cy.get('#delete-confirmation-dialog').should('not.be.checked')
    cy.get('[data-cy-id="build-set-name-main"]').should('exist')
  })

  it('Opens the new build set form', () => {
    cy.get('[data-cy-id=build-set-add]').click()
    cy.location('pathname').should('eq', '/edit-build-set/new')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', '')
  })
})

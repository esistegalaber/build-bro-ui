// Expects the API on :8080 with testdata.sql loaded (build set templates 'main',
// 'feature-test-stage-1' and 'Environment of StageServer').
describe('Build Sets Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', pathname: '/api/v1/build-sets'}).as('build-sets')
    cy.visit('/build-sets')
    cy.wait('@build-sets')
  })

  it('Lists the build set templates', () => {
    cy.get('[data-cy-id="build-set-name-main"]').should('be.visible')
    cy.get('[data-cy-id="build-set-name-feature-test-stage-1"]').should('be.visible')
    cy.get('[data-cy-id="build-set-name-Environment of StageServer"]').should('be.visible')
    cy.get('[data-cy-id=build-set-card]').should('not.exist')
    cy.get('[data-cy-id=build-set-none]').should('be.visible')
  })

  it('Summarizes each build set', () => {
    cy.get('[data-cy-id="build-set-name-main"]').should('contain.text', '2 projects · 1 pinned')
    cy.get('[data-cy-id="build-set-name-feature-test-stage-1"]').should('contain.text', 'No projects yet')
  })

  it('Shows an empty state for a build set without builds', () => {
    cy.get('[data-cy-id="build-set-name-feature-test-stage-1"]').click()
    cy.get('[data-cy-id=build-set-card]').should('contain.text', 'Builds of feature-test-stage-1')
    cy.get('[data-cy-id=build-set-empty]').should('be.visible')
  })

  it('Shows the builds of a selected build set', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/of/main'}).as('build-set')
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.wait('@build-set')
    cy.get('[data-cy-id="build-set-name-main"]').should('have.class', 'menu-active')
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
    cy.get('[data-cy-id=delete-confirmation-dialog]').should('have.class', 'modal-open').and('contain.text', 'Delete main?')
    cy.focused().should('have.attr', 'data-cy-id', 'delete-cancel')
    cy.get('[data-cy-id=delete-cancel]').click()
    cy.get('[data-cy-id=delete-confirmation-dialog]').should('not.have.class', 'modal-open')
    cy.get('[data-cy-id="build-set-name-main"]').should('exist')
  })

  it('Closes the delete confirmation with Escape', () => {
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.get('[data-cy-id=build-set-delete]').click()
    cy.get('[data-cy-id=delete-cancel]').should('be.focused').type('{esc}')
    cy.get('[data-cy-id=delete-confirmation-dialog]').should('not.have.class', 'modal-open')
  })

  it('Opens the new build set form', () => {
    cy.get('[data-cy-id=build-set-add]').click()
    cy.location('pathname').should('eq', '/edit-build-set/new')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', '')
  })
})

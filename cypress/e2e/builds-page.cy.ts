const buildsSearchRequest = {
  method: 'POST',
  url: '/api/v1/builds/search',

}
describe('Builds Page', () => {

  it('Search Builds of Project "backend"', () => {
    loadBuildPage()
    loadLastPage()
    selectBackofficeProject()
    selectMainBranch()
  })

  function loadBuildPage() {
    cy.intercept(buildsSearchRequest).as('empty-search-response')
    // open builds page
    cy.visit('/builds')
    cy.wait('@empty-search-response')
    //check the visible builds
    cy.get('[data-cy-id=build-10]').should('exist')
  }

  function loadLastPage() {
    //intercept search call
    cy.intercept(buildsSearchRequest).as('paginator-last')
    // click 'last' button
    cy.get('[data-cy-id=paginator-last]').click()
      .wait('@paginator-last')
      .its('request.body').should('contain', {"page": 8})
    //check the visible builds
    cy.get('[data-cy-id=build-81]').should('exist')
  }

  function selectBackofficeProject() {
    // select the backoffice project
    cy.intercept(buildsSearchRequest).as('backoffice-search-response')
    cy.get('[data-cy-id=project-select]')
      .select('backoffice')
      .wait('@backoffice-search-response')
      .its('request.body')
      .should('contain', {"project": "backoffice", "page": 0});

    cy.get('[data-cy-id=build-70]').should('exist')
      .click()
  }

  function selectMainBranch() {
    // select the backoffice project
    cy.intercept(buildsSearchRequest).as('backoffice-main-response')
    cy.get('[data-cy-id=branch-select]')
      .select('next')
      .wait('@backoffice-main-response')
      .its('request.body')
      .should('contain', {"project": "backoffice", "branch": "next", "page": 0});
    cy.get('[data-cy-id=build-71]').should('exist')
      .click()
  }
})

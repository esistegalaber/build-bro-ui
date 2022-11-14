describe('Load Builds Page', () => {
  beforeEach(() => {
    cy.intercept({
        method: 'GET',
        url: '/api/v1/stats',
      }, {fixture: 'stats/build-stats.json'}
    ).as('stats')
    cy.intercept({
        method: 'GET',
        url: '/api/v1/search-data',
      }, {fixture: 'search-data/search-data.json'}
    ).as('search-data')
    cy.intercept({
        method: 'POST',
        url: '/api/v1/builds/search',
      }, {fixture: 'builds/search-builds-of-backend-response.json'}
    ).as('search-builds-of-backend-response')
  })


  it('Search Builds of Project "backend"', () => {
    // open /builds
    cy.visit('/builds')
    // paginator should be hidden
    cy.get('[data-cy-id=paginator]').should('not.exist')
    // select the backend project
    cy.get('[data-cy-id=project-select]')
      .select('backend')
      .wait('@search-builds-of-backend-response')
    // paginator should be visible
    cy.get('[data-cy-id=paginator]').should('be.visible')
    // verify the search request body
    cy.get('@search-builds-of-backend-response')
      .its('request.body')
      .should('contain', {"project": "backend", "page": 0});
    // setup data for second page request
    cy.intercept({
        method: 'POST',
        url: '/api/v1/builds/search',
      }, {fixture: 'builds/search-second-page.json'}
    ).as('search-second-page')
    // click the "next page button" in pagnator
    cy.get('[data-cy-id=paginator] > ul > li').last()
      .click()
      .wait('@search-second-page')
    // verify the second page search request body
    cy.get('@search-second-page')
      .its('request.body')
      .should('contain', {"project": "backend", "page": 1});
    //setup filtering main branch
    cy.intercept({
        method: 'POST',
        url: '/api/v1/builds/search',
      }, {fixture: 'builds/search-main-of-backend.json'}
    ).as('search-main-of-backend')
    // select "main" branch
    cy.get('[data-cy-id=branch-select]')
      .select('main')
      .wait('@search-main-of-backend')
    // verify query from search request post body
    cy.get('@search-main-of-backend')
      .its('request.body')
      .should('contain', {"project": "backend", "branch": "main", "page": 0});


  })
})

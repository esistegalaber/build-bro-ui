describe('Load Builds Page', () => {

  it('Search Builds of Project "backend"', () => {
    // open /builds
    cy.visit('/builds')
    // paginator should be hidden
    cy.get('[data-cy-id=paginator]').should('not.exist')
    // select the backend project
    cy.get('[data-cy-id=project-select]')
      .select('backend')
      .wait(100)
    // paginator should be visible
    cy.get('[data-cy-id=paginator]').should('be.visible')
    // click the "next page button" in pagnator
    cy.get('[data-cy-id=paginator-next]').click()
    // select "main" branch
    cy.get('[data-cy-id=branch-select]')
      .select('main')
      .wait(100)
    // verify query from search request post body
    // cy.get('@search-main-of-backend')
    //   .its('request.body')
    //   .should('contain', {"project": "backend", "branch": "main", "page": 0});


  })
})

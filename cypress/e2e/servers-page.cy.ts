// Expects the API on :8080 with testdata.sql loaded: servers testserver (nick name 'Tester'), staging and prod-1.
// The edit test restores the original nick name, so the suite can be re-run against the same data.
describe('Servers Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', url: '/api/v1/servers'}).as('servers')
    cy.visit('/servers')
    cy.wait('@servers')
  })

  it('Lists the servers', () => {
    cy.get('[data-cy-id=servers-count]').should('have.text', ' 3 servers ')
    cy.get('[data-cy-id=server-testserver]').should('contain.text', 'Tester')
    cy.get('[data-cy-id=server-staging]').should('contain.text', 'Company Staging')
    cy.get('[data-cy-id=server-prod-1]').should('contain.text', 'Prod')
    cy.get('[data-cy-id=server-nickname]').should('not.exist')
  })

  it('Edits the nick name of a server', () => {
    const newNickName = `Tester-${Date.now()}`
    saveNickName(newNickName)
    cy.get('[data-cy-id=server-testserver]').should('contain.text', newNickName)
    cy.get('[data-cy-id=server-nickname]').should('not.exist')

    // restore the original value
    saveNickName('Tester')
    cy.get('[data-cy-id=server-testserver]').should('contain.text', 'Tester')
      .and('not.contain.text', newNickName)
  })

  it('Cancels an edit without saving', () => {
    cy.get('[data-cy-id=server-staging] [data-cy-id=server-edit]').click()
    cy.get('[data-cy-id=server-nickname]').should('be.focused').clear().type('Not saved')
    cy.get('[data-cy-id=edit-server-cancel]').click()
    cy.get('[data-cy-id=server-nickname]').should('not.exist')
    cy.get('[data-cy-id=server-staging]').should('contain.text', 'Company Staging')
  })

  function saveNickName(nickName: string) {
    cy.get('[data-cy-id=server-testserver] [data-cy-id=server-edit]').click()
    cy.get('[data-cy-id=server-description]').should('have.value', 'Main Testing Server')
    cy.get('[data-cy-id=server-nickname]').clear().type(nickName)
    cy.intercept({method: 'POST', url: '/api/v1/servers'}).as('save-server')
    cy.get('[data-cy-id=server-save]').click()
    cy.wait('@save-server').its('request.body')
      .should('deep.include', {id: 1, name: 'testserver', nickName, description: 'Main Testing Server'})
  }
})

describe('Exportar Dados Pessoais', () => {

    beforeEach(() => {
        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('utente@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
    });

    it('Os dados exportados com sucesso!', () => {
        cy.intercept('GET', '/api/user/utente').as('exportarDados');
        cy.visit('/exportarDadosPessoais')
        cy.get('button').click();
        cy.wait('@exportarDados');
        cy.get('[name="app-message"]').contains("Os dados foram exportados com sucesso!");
    });
})

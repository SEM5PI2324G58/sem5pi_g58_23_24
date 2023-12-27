describe('Alterar dados user', () => {

    beforeEach(() => {

        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('PUT', '/api/user').as('alterarDadosUser');

        //Criar um utilizador para testar o login
        cy.visit('/registar');
        cy.get('[name="role"]').select('utente');
        cy.get('[name="name"]').type('UtilizadorTeste');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[name="email"]').type('utilizadorTeste@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="nif"]').type('123123123');
        cy.get('button').click();
        cy.wait('@signup')

        cy.visit('/login');
        cy.get('[name="email"]').type('utilizadorTeste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
    });

    it('alterar dados tem sucesso', () => {
        cy.visit('/alterarDadosUtente');
        cy.get('[name="nome"]').type('NovoUtilizadorTeste');
        cy.get('[name="nif"]').type('777888999');
        cy.get('[name="tel"]').type('967654321');
        cy.get('button').click();
        cy.wait('@alterarDadosUser').then((interception) => {
            expect(interception?.response?.statusCode).to.equal(200);
        });
    });

    afterEach(() => {
        //TODO apagar utilizador
    });
})
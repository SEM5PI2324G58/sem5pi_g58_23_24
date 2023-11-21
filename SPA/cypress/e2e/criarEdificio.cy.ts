describe('Edificio', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
    });
    
    it('Criar edificio com sucesso', () => {
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click();
        cy.wait('@createEdificio');
        cy.get('[name="app-message"]').contains('Edificio com código: T1 criado com sucesso!');

    })

    afterEach(() => {
        //TODO: apagar edificio
    });
})

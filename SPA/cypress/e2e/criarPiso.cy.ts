describe('Criar piso', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        
        //Criar um edificio
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click();
        cy.wait('@createEdificio');


    });
    
    it('Criar piso sucesso e2e', () => {
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click();
        cy.wait('@createPiso').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });;

        
        cy.get('[name="app-message"]').contains('Piso com código: T1, número Piso: 1, descrição: Descricao1 criado com sucesso!');

    })

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
    });
})

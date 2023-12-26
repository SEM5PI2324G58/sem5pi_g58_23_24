var id : string;

describe('Criar Delivery', () => {

    beforeEach(() => {
        cy.intercept('POST', '/api/Tarefa').as('createTarefa');
    });
    
    it('Criar vigilância sucesso e2e', () => {
        cy.visit('/criarTarefaPickUpDelivery');
        
        cy.get('[name="codConf"]').type('12345');
        cy.get('[name="desc"]').type("desc");
        cy.get('[name="nomePickUp"]').type('ABC');
        cy.get('[name="numeroPickUp"]').type('123456789');
        cy.get('[name="nomeDelivery"]').type('ABC');
        cy.get('[name="numeroDelivery"]').type('123456789');
        cy.get('[name="salaInicial"]').type('A203');
        cy.get('[name="salaFinal"]').type('A202');
        
        
        cy.get('button').click();
        cy.wait('@createTarefa').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201);
            id = interception.response?.body.id;
        })
    })
    
    afterEach(() => {
        cy.intercept('DELETE', '/api/Tarefa?id='+id).as('deleteTarefa');
        cy.visit('/apagarTarefa');
        cy.get('[name="id"]').type(id);
        cy.get('button').click();
        cy.wait('@deleteTarefa').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200);
        })
    });
})

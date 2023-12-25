import { method } from "cypress/types/bluebird";

var id : string;

describe('Listar dispositivos da frota', () => {

    
    beforeEach(() => {
        
        cy.intercept('PUT', '/api/Tarefa').as('alterarEstado');
        cy.intercept('GET', '/api/dispositivo/tipoTarefa').as('dispositivo');
        cy.intercept('GET', '/api/Tarefa/tarefasPendentes').as('tarefasPendentes');

    });

    it('listar TarefasPendentes Tem O Formato Esperado', () => {
        
        cy.visit('/aprovarTarefas');
        cy.wait('@tarefasPendentes');~


        cy.get('th').should('contain', 'Id Tarefa');
        cy.get('th').should('contain', 'Tipo de Tarefa');
        cy.get('th').should('contain', 'Sala Inicial - SalaFinal');
        cy.get('th').should('contain', 'Edificio - Piso');
        cy.get('th').should('contain', 'Email do Requisitador');
        cy.get('th').should('contain', 'Aprovar/Recusar');
            
    })


    afterEach(() => {

    });
    
});




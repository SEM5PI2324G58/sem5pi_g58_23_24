import {Response, Request, NextFunction} from 'express';import * as sinon from 'sinon';
import Container from 'typedi';
import  IEdificioDTO  from '../../src/dto/IEdificioDTO';
import { Result }  from '../../src/core/logic/Result';
import EdificioController from '../../src/controllers/EdificioController';
import IEdificioService from '../../src/services/IServices/IEdificioService';





describe('EdificioController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(10000);
        Container.reset();
        
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoRepoInstance);

        let edificioServiceClass = require('../../src/services/EdificioService').default;
        let edificioServiceInstance = Container.get(edificioServiceClass);
        Container.set("EdificioService", edificioServiceInstance);
    });
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('Criar edificio retorna edificio JSON', async function() {
            
            // Arrange
            let body = {
                "codigo": "as1",
                "nome": "ola",
                "descricao": "ola",
            };
    
            let req: Partial<Request> = {};
            req.body = body;
    
            let res: Partial<Response> = {
                json: sinon.spy()
            };
    
            let next: Partial<NextFunction> = () => {};
            let edificioServiceInstance = Container.get("EdificioService");
            sinon.stub(edificioServiceInstance, 'criarEdificio').returns(Promise.resolve(Result.ok<IEdificioDTO>(body as IEdificioDTO)));

            let edificioController = new EdificioController(edificioServiceInstance as IEdificioService);
    
            // Act
            await edificioController.criarEdificio(<Request> req,<Response> res, <NextFunction> next);
    
            // Assert
            sinon.assert.calledOnce(res.json as sinon.SinonSpy);
            sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });

    it('Listar edificio retorna lista de edificios em JSON', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
        } as IEdificioDTO
        listaDTO.push(edificioDTO);

        let req: Partial<Request> = {};
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        sinon.stub(edificioServiceInstance, 'listarEdificios').returns(Promise.resolve(Result.ok<IEdificioDTO[]>(listaDTO)));

        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService);

        // Act
        await edificioController.listarEdificios(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('listarEdificioMinEMaxPisos retorna lista de edificios em JSON', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
           // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };

        let req: Partial<Request> = {};req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        sinon.stub(edificioServiceInstance, 'listarEdificioMinEMaxPisos').returns(Promise.resolve(Result.ok<IEdificioDTO[]>(listaDTO)));

        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService);

        // Act
        await edificioController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });
    
    it('Editar edificio retorna edificio JSON', async function() {
        let body = {
            "codigo" : "ED01",
            "nome" : "Edificio A",
            "descricao" : "Edificio A",
        }
        
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        sinon.stub(edificioServiceInstance, 'editarEdificio').returns(Promise.resolve(Result.ok<IEdificioDTO>(body as IEdificioDTO)));
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService);

        //Act
        await edificioController.editarEdificio(<Request> req,<Response> res, <NextFunction> next);

        //Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });

  
});
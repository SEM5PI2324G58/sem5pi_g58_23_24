import {Response, Request, NextFunction} from 'express';import * as sinon from 'sinon';
import Container from 'typedi';
import  IEdificioDTO  from '../../src/dto/IEdificioDTO';
import { Result }  from '../../src/core/logic/Result';
import EdificioController from '../../src/controllers/EdificioController';
import IEdificioService from '../../src/services/IServices/IEdificioService';
import { Nome } from '../../src/domain/edificio/Nome';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Piso } from '../../src/domain/piso/Piso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { IEdificioPersistence } from '../../src/dataschema/IEdificioPersistence';
import { Document } from 'mongoose';





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
 
    it('EdificioController + EdificioService teste de integração ao método listarEdificioMinEMaxPisos', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
           // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [Piso.create({numeroPiso: NumeroPiso.create(1).getValue(),
                                    descricaoPiso: DescricaoPiso.create("ola").getValue(),
                                    mapa: [[]]}, IdPiso.create(1).getValue()).getValue()],
                                
        };

        let req: Partial<Request> = {};req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");


        let edificioServiceInstance = Container.get("EdificioService");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));        
        const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificioMinEMaxPisos');

        const pisoController =  new EdificioController(edificioServiceInstance as IEdificioService); 
        // Act
        await pisoController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

     
    it('EdificioController + EdificioService + EdificioRepo teste de integração ao método listarEdificioMinEMaxPisos', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
        // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };


        let listaPiso : number [] = []; 
        
        const edificioDTO2 = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        let req: Partial<Request> = {};req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "find").returns([edificioDTO2]);

        let edificioServiceInstance = Container.get("EdificioService");
        const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificioMinEMaxPisos');
        const pisoController =  new EdificioController(edificioServiceInstance as IEdificioService); 
        // Act
        await pisoController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
    });


});
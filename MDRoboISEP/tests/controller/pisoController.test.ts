import "reflect-metadata";
import {Response, Request, NextFunction} from 'express';
import { Container } from 'typedi';
import { Result }  from '../../src/core/logic/Result';
import * as sinon from 'sinon';
import PisoController from '../../src/controllers/PisoController';
import IPisoService from '../../src/services/IServices/IPisoService';
import  ICriarPisoDTO  from '../../src/dto/ICriarPisoDTO';
import { IPisoPersistence } from "../../src/dataschema/IPisoPersistence";
import { IEdificioPersistence } from "../../src/dataschema/IEdificioPersistence";
import { IPontoPersistence } from "../../src/dataschema/IPontoPersistence";

import 'mocha';
import { Document } from 'mongoose';
import { PisoMap } from "../../src/mappers/PisoMap";
import { Piso } from "../../src/domain/piso/Piso";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import {DescricaoPiso} from '../../src/domain/piso/DescricaoPiso'
import {NumeroPiso} from '../../src/domain/piso/NumeroPiso'
import {IdPiso} from '../../src/domain/piso/IdPiso'
import {Ponto} from '../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../src/domain/ponto/IdPonto';
import IEdificioDTO from "../../src/dto/IEdificioDTO";
import IPisoDTO from "../../src/dto/IPisoDTO";
import IEditarPisoDTO from "../../src/dto/IEditarPisoDTO";



describe('PisoController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(20000);
        Container.reset();

        
        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);

        let pontoRepoClass = require('../../src/repos/PontoRepo').default;
        let pontoRepoInstance = Container.get(pontoRepoClass);
        Container.set("PontoRepo", pontoRepoInstance);

        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoRepoInstance);

        let pisoServiceClass = require('../../src/services/PisoService').default;
        let pisoServiceInstance = Container.get(pisoServiceClass);
        Container.set("PisoService", pisoServiceInstance);


    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('criarPiso retorna piso JSON', async function() {
        
        // Arrange
        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

    
        let pisoServiceInstance = Container.get("PisoService");
        
        

        sinon.stub(pisoServiceInstance, 'criarPiso').returns(Promise.resolve(Result.ok<ICriarPisoDTO>(body as ICriarPisoDTO)));

        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
        
        // Act
        await pisoController.criarPiso(<Request>req, <Response>res, <NextFunction>next);

        //Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            codigo: "as1",
            numeroPiso: 0,
            descricaoPiso: "ola",
        }));

        
    });

    it('PisoController + PisoService integration test criar piso', async function () {	
		// Arrange	
        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => {};

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };

		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;

        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificio));
        sinon.stub(pontoRepoInstance, "getMaxId").returns(Promise.resolve(0));


        let pisoServiceInstance = Container.get("PisoService");
        const pisoServiceSpy = sinon.spy(pisoServiceInstance, 'criarPiso');

        const pisoController = new PisoController(pisoServiceInstance as IPisoService);

		// Act
		let answer = await pisoController.criarPiso(<Request>req, <Response>res, <NextFunction>next);

		// Assert
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy, body);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledWith(res.json, body as ICriarPisoDTO)
        
	});
    
    it('PisoController + PisoService + PisoRepo integração test criar piso devolve piso', async function () {	
		// Arrange	
        let body = {
            "codigo": "ED01",
            "numeroPiso": 1,
            "descricaoPiso": "ola",
        };
        let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let pontoArray  : Ponto[][] = [];
        let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;
        let listaPisos : number[] = [];
        
        let edificioDoc  = {
            codigo: 'ED01',
            nome: 'string',
            descricao: 'string',
            dimensaoX: 1,
            dimensaoY: 1,
            piso:  listaPisos,
            save() { return this; }
        }  as unknown as IEdificioPersistence & Document<any, any, any>;

        let pontoId  : String[][] = [[]];
        pontoId[0][0] = pontoArray[0][0].id.toString()

        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola", 
            pontos: pontoId,
        } as IPisoPersistence;

        const pontoDTO = {
            domainID: 1,
            tipoPonto: " ",
            ordenada: 0,
            abscissa: 0,
        } as IPontoPersistence;



        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => {};

        const pisoSchemaInstance = Container.get("PisoSchema");
        const edificioSchemaInstance = Container.get("EdificioSchema");
        const pontoSchemaInstance = Container.get("PontoSchema");

        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioDoc);
        sinon.stub(pisoSchemaInstance, "find").returns(null);
        sinon.stub(pisoSchemaInstance, "findOne").returns(null);
        sinon.stub(pisoSchemaInstance, "create").returns(pisoDTO as IPisoPersistence);
        sinon.stub(edificioSchemaInstance, "create").returns(edificioDoc as IEdificioPersistence);
        sinon.stub(pontoSchemaInstance, "findOne").returns(null);
        sinon.stub(pontoSchemaInstance, "create").returns(pontoDTO as IPontoPersistence);
        sinon.stub(pontoSchemaInstance, "find").returns(null);

        let pisoServiceInstance = Container.get("PisoService");
        const pisoServiceSpy = sinon.spy(pisoServiceInstance,'criarPiso');
        const pisoController = new PisoController(pisoServiceInstance as IPisoService);

        let answer = await pisoController.criarPiso(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy,body as ICriarPisoDTO);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body as ICriarPisoDTO);

	});

    it('listarTodosOsPisosDeUmEdificio retorna piso JSON', async function() {
        
        // Arrange
        let body = {
            "codigo": "as1",
        };

        const pisoDTO = {
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
        } as IPisoDTO;

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let pisoServiceInstance = Container.get("PisoService");

        sinon.stub(pisoServiceInstance, 'listarTodosOsPisosDeUmEdificio').returns(Promise.resolve(Result.ok<IPisoDTO>((pisoDTO))));

        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
        
        // Act
        await pisoController.listarTodosOsPisosDeUmEdificio(<Request>req, <Response>res, <NextFunction>next);

        //Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
        }));
    });

    it('PisoController + PisoService listarTodosOsPisosDeUmEdificio retorna piso json', async function() {
        
        // Arrange
        let body = {
            "codigo": "as1",
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };

        let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: [],
        }, IdPiso.create(1).getValue()).getValue();

        const edificio = Edificio.create(edificioProps,Codigo.create('as1').getValue()).getValue();
        edificio.addPiso(piso);
        
        let pisoServiceInstance = Container.get("PisoService");
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificio));

        const pisoServiceSpy = sinon.spy(pisoServiceInstance, 'listarTodosOsPisosDeUmEdificio');
        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
                
        // Act
        await pisoController.listarTodosOsPisosDeUmEdificio(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy, "as1");
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, [{
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
        }]);

    });

    it('PisoController + PisoService + EdificioRepo listarTodosOsPisosDeUmEdificio retorna piso json', async function() {
    
        // Arrange
        let body = {
            "codigo": "as1",
        };
        let req: Partial<Request> = {};
        req.body = body;
    
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const pisoPersistence = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: []
        } as IPisoPersistence;

        const edificioPersistence = {
            codigo : "as1",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [1],
        } as IEdificioPersistence ;

        const edificioSchemaInstance = Container.get("EdificioSchema");
        const pisoSchemaInstance = Container.get("PisoSchema");
        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioPersistence);
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoPersistence);

            
        let pisoServiceInstance = Container.get("PisoService");
        const pisoServiceSpy = sinon.spy(pisoServiceInstance, 'listarTodosOsPisosDeUmEdificio');
        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
                
        // Act
        let answer = await pisoController.listarTodosOsPisosDeUmEdificio(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy, "as1");
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, [{
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
        }]);
        
    });

    it('editarPiso retorna piso JSON', async function() {
        
        // Arrange
        let body = {
            "codigoEdificio": "ED01",
	        "numeroPiso": 0,
            "novoNumeroPiso": 1,
	        "descricaoPiso": "ola"
        }

        const pisoDTO = {
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "ola",
        } as IPisoDTO;

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let pisoServiceInstance = Container.get("PisoService");

        sinon.stub(pisoServiceInstance, 'editarPiso').returns(Promise.resolve(Result.ok<IPisoDTO>((pisoDTO))));

        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
        
        // Act
        await pisoController.editarPiso(<Request>req, <Response>res, <NextFunction>next);

        //Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "ola",
        }));
    });

    it('PisoController + PisoService editarPiso retorna piso json', async function() {
        
        // Arrange
        let body = {
            "codigoEdificio": "ED01",
	        "numeroPiso": 0,
            "novoNumeroPiso": 1,
	        "descricaoPiso": "ola"
        }
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };

        let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(0).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: [],
        }, IdPiso.create(1).getValue()).getValue();

        let piso2 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("ola").getValue(),
            mapa: [],
        }, IdPiso.create(1).getValue()).getValue();

        const edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        edificio.addPiso(piso);
        
        let pisoServiceInstance = Container.get("PisoService");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificio));
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(piso2));
        const pisoServiceSpy = sinon.spy(pisoServiceInstance, 'editarPiso');
        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
                
        // Act
        await pisoController.editarPiso(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy, body as IEditarPisoDTO);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, {
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "ola",
        });
    });

    it('PisoController + PisoService + PisoRepo + EdificioRepo editarPiso retorna piso json', async function() {
        
        // Arrange
        let body = {
            "codigoEdificio": "ED01",
	        "numeroPiso": 0,
            "novoNumeroPiso": 1,
	        "descricaoPiso": "ola"
        }
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const pisoPersistence = {
            domainID: 1,
            numeroPiso: 0,
            descricaoPiso: "Ola",
            pontos: [],
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;

        const edificioPersistence = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [1],
        } as IEdificioPersistence ;

        
        const edificioSchemaInstance = Container.get("EdificioSchema");
        const pisoSchemaInstance = Container.get("PisoSchema");
        let pisoServiceInstance = Container.get("PisoService");
        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioPersistence);
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoPersistence);


        const pisoServiceSpy = sinon.spy(pisoServiceInstance, 'editarPiso');
        const pisoController = new PisoController(pisoServiceInstance as IPisoService);
                
        // Act
        let answer = await pisoController.editarPiso(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(pisoServiceSpy);
        sinon.assert.calledWith(pisoServiceSpy, body as IEditarPisoDTO);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, {
            id: 1,
            numeroPiso: 1,
            descricaoPiso: "ola",
        });
    });

});

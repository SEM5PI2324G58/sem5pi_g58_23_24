import "reflect-metadata";
import {Response, Request, NextFunction} from 'express';
import { Container } from 'typedi';
import { Result }  from '../../src/core/logic/Result';
import * as sinon from 'sinon';
import DispositivoController from '../../src/controllers/ImplControllers/DispositivoController';
import IDispositivoService from '../../src/services/IServices/IDispositivoService';
import IAdicionarRoboAFrotaDTO from "../../src/dto/IAdicionarRoboAFrotaDTO";
import { TipoTarefa } from "../../src/domain/tipoDispositivo/TipoTarefa";
import { Marca } from "../../src/domain/tipoDispositivo/Marca";
import { Modelo } from "../../src/domain/tipoDispositivo/Modelo";
import { TipoDispositivo } from "../../src/domain/tipoDispositivo/TipoDispositivo";
import { IdTipoDispositivo } from "../../src/domain/tipoDispositivo/IdTipoDispositivo";
import { DescricaoDispositivo } from "../../src/domain/dispositivo/DescricaoDispositivo";
import { Nickname } from "../../src/domain/dispositivo/Nickname";
import { NumeroDeSerie } from "../../src/domain/dispositivo/NumeroDeSerie";
import { EstadoDispositivo } from "../../src/domain/dispositivo/EstadoDispositivo";
import { Dispositivo } from "../../src/domain/dispositivo/Dispositivo";
import { CodigoDispositivo } from "../../src/domain/dispositivo/CodigoDispositivo";
import { ITipoDispositivoPersistence } from "../../src/dataschema/ITipoDispositivoPersistence";
import { IDispositivoPersistence } from "../../src/dataschema/IDispositivoPersistence";
import DispositivoRepo from "../../src/repos/DispositivoRepo";
import TipoDispositivoRepo from "../../src/repos/TipoDispositivoRepo";

import 'mocha';
import IDispositivoDTO from "../../src/dto/IDispositivoDTO";




describe('DispositivoController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(20000);
        Container.reset();

        let tipoDispositivoProps : any = {
            tipoTarefa: [TipoTarefa.create('Vigilancia').getValue()],
            marca: Marca.create('Marca').getValue(),
            modelo: Modelo.create('Modelo').getValue(),
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,IdTipoDispositivo.create(1).getValue()).getValue();
        Container.set("tipoDispositivo", tipoDispositivo);

        let dispositivoProps : any = {
            descricaoDispositivo: DescricaoDispositivo.create("asdasdqwe123").getValue(),
            estado: EstadoDispositivo.create(true).getValue(),
            nickname: Nickname.create("ola").getValue(),
            numeroSerie: NumeroDeSerie.create("123456789").getValue(),
            tipoDeDispositivo: tipoDispositivo,
        };
        const dispositivo = Dispositivo.create(dispositivoProps,CodigoDispositivo.create("as1").getValue()).getValue();
        Container.set("dispositivo", dispositivo);

        
        let dispositivoSchemaInstance = require('../../src/persistence/schemas/DispositivoSchema').default;
        Container.set("DispositivoSchema", dispositivoSchemaInstance);

        let tipoDispositivoSchemaInstance = require('../../src/persistence/schemas/TipoDispositivoSchema').default;
        Container.set("TipoDispositivoSchema", tipoDispositivoSchemaInstance);

        let tipoDispositivoRepoClass = require('../../src/repos/TipoDispositivoRepo').default;
        let tipoDispositivoRepoInstance = Container.get(tipoDispositivoRepoClass);
        Container.set("TipoDispositivoRepo", tipoDispositivoRepoInstance);

        let dispositivoRepoClass = require('../../src/repos/DispositivoRepo').default;
        let dispositivoRepoInstance = Container.get(dispositivoRepoClass);
        Container.set("DispositivoRepo", dispositivoRepoInstance);

        let dispositivoServiceClass = require('../../src/services/ImplServices/DispositivoService').default;
        let dispositivoServiceInstance = Container.get(dispositivoServiceClass);
        Container.set("DispositivoService", dispositivoServiceInstance);

    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('adicionarDispositivoAFrota retorna piso JSON', async function() {
        
        // Arrange
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let resultado = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "estado": true,
            "numeroSerie": "123456789"
        };
    
        let dispositivoServiceInstance = Container.get("DispositivoService");
        
        

        sinon.stub(dispositivoServiceInstance, 'adicionarDispositivoAFrota').returns(Promise.resolve(Result.ok<IDispositivoDTO>(resultado as IDispositivoDTO)));

        const pisoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);
        
        // Act
        let answer = await pisoController.adicionarDispositivoAFrota(<Request>req, <Response>res, <NextFunction>next);

        //Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            nickname: "ola",
            estado: true,
            numeroSerie: "123456789"
        }));

        
    });

    it('DispositivoController + DispositivoService integration test criar piso', async function () {	
		 // Arrange
         let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let resultado = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "estado": true,
            "numeroSerie": "123456789"
        };

		

        let dispositivoServiceInstance = Container.get("DispositivoService");
        const dispositivoServiceSpy = sinon.spy(dispositivoServiceInstance, 'adicionarDispositivoAFrota');

        const dispositivoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);
        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNickname").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNumeroSerie").returns(Promise.resolve([]));
        sinon.stub(dispositivoRepoInstance, "save").returns(Promise.resolve(Container.get("dispositivo")));

		// Act
		let answer = await dispositivoController.adicionarDispositivoAFrota(<Request>req, <Response>res, <NextFunction>next);

		// Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(dispositivoServiceSpy);
        sinon.assert.calledWith(dispositivoServiceSpy, body);
        sinon.assert.calledWith(res.json, resultado as IDispositivoDTO)
        
	});


    it('DispositivoController + DispositivoService + DispositivoRepo integração test criar piso devolve piso', async function () {	
		// Arrange	
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let resultado = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "estado": true,
            "numeroSerie": "123456789"
        };

        const tipoDispositivoPersistence = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence;

        const dispositivoPersistence = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            estado: true,
            nickname: "ola",
            numeroSerie: "123456789",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        let dispositivoServiceInstance = Container.get("DispositivoService");
        const dispositivoServiceSpy = sinon.spy(dispositivoServiceInstance, 'adicionarDispositivoAFrota');
        const dispositivoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);

        let dispositivoSchemaInstance = Container.get("DispositivoSchema");
        let tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(tipoDispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(Promise.resolve(null));
        sinon.stub(dispositivoSchemaInstance, "find").returns([]);
        sinon.stub(dispositivoSchemaInstance, "create").returns(Promise.resolve(dispositivoPersistence as IDispositivoPersistence));


        let answer = await dispositivoController.adicionarDispositivoAFrota(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(dispositivoServiceSpy);
        sinon.assert.calledWith(dispositivoServiceSpy,body as IAdicionarRoboAFrotaDTO);
        sinon.assert.calledWith(res.json, resultado as IDispositivoDTO)
    });

    it('listarDispositivosDaFrota retorna lista de dispositivos em JSON', async function() {

        let listaDTO : IDispositivoDTO[] = [];
        let dispositivoDTO = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            nickname: "ola",
            estado: true,
            numeroSerie: "123456789"
        } as IDispositivoDTO
        listaDTO.push(dispositivoDTO);
           
        let body = {
        };

        let req: Partial<Request> = {};req.body = body;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let dispositivoServiceInstance = Container.get("DispositivoService");
        sinon.stub(dispositivoServiceInstance, 'listarDispositivosDaFrota').returns(Promise.resolve(Result.ok<IDispositivoDTO[]>(listaDTO)));

        let dispositivoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);

        
        let answer = await dispositivoController.listarDispositivosDaFrota(<Request> req,<Response> res, <NextFunction> next);

        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('(Listar dispositivos da frota) Teste integração DispositivoController + DispositivoService', async function() {

        let listaDTO : IDispositivoDTO[] = [];
        let dispositivoDTO = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            nickname: "ola",
            estado: true,
            numeroSerie: "123456789"
        } as IDispositivoDTO
        
        listaDTO.push(dispositivoDTO);
        
        let body = {
        };

        let req: Partial<Request> = {};req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let dispositivoServiceInstance = Container.get("DispositivoService");
        let dispositivoRepoInstance = Container.get("DispositivoRepo");

        let dispositivos : Dispositivo[] = [];
        dispositivos.push(Container.get("dispositivo"));

        sinon.stub(dispositivoRepoInstance, "findAll").returns(Promise.resolve(dispositivos));
        
        let dispositivoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);
        let answer = await dispositivoController.listarDispositivosDaFrota(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('(Listar dispositivos da frota) Teste integração DispositivoController + DispositivoService + DispositivosRepo', async function() {

        let listaDTO : IDispositivoDTO[] = [];
        let dispositivoDTO = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            nickname: "ola",
            estado: true,
            numeroSerie: "123456789"
        } as IDispositivoDTO
        
        listaDTO.push(dispositivoDTO);
        
        const dispositivoPersistence = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            estado: true,
            nickname: "ola",
            numeroSerie: "123456789",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        let body = {
        };

        let req: Partial<Request> = {};req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let dispositivoServiceInstance = Container.get("DispositivoService");
        let dispositivoSchemaInstance = Container.get("DispositivoSchema");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");


        sinon.stub(dispositivoSchemaInstance, "find").returns(Promise.resolve([dispositivoPersistence as IDispositivoPersistence]));
        
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        
        let dispositivoController = new DispositivoController(dispositivoServiceInstance as IDispositivoService);
        let answer = await dispositivoController.listarDispositivosDaFrota(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });
});
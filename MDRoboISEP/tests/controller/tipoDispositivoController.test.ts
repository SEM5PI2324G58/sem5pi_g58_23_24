import * as sinon from 'sinon';
import Container from 'typedi';
import { Request, Response, NextFunction } from 'express';
import TipoDispositivoController from '../../src/controllers/TipoDispositivoController';
import ITipoDispositivoService from '../../src/services/IServices/ITipoDispositivoService';
import ITipoDispositivoDTO from '../../src/dto/ITipoDispositivoDTO';
import { Result } from '../../src/core/logic/Result';
import { TipoDispositivo } from '../../src/domain/tipoDispositivo/TipoDispositivo';
import { IdTipoDispositivo } from '../../src/domain/tipoDispositivo/IdTipoDispositivo';
import { TipoTarefa } from '../../src/domain/tipoDispositivo/TipoTarefa';
import { Marca } from '../../src/domain/tipoDispositivo/Marca';
import { Modelo } from '../../src/domain/tipoDispositivo/Modelo';

describe('Tipo Dispositivo Controller', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        Container.reset();
        let tipoDispositivoSchemaInstance = require('../../src/persistence/schemas/TipoDispositivoSchema').default;
        Container.set("TipoDispositivoSchema", tipoDispositivoSchemaInstance);

        let tipoDispositivoRepoClass = require('../../src/repos/TipoDispositivoRepo').default;
        let tipoDispositvoRepoInstance = Container.get(tipoDispositivoRepoClass);
        Container.set("TipoDispositivoRepo", tipoDispositvoRepoInstance);

        let tipoDispositivoServiceClass = require('../../src/services/TipoDispositivoService').default;
        let tipoDispositivoServiceInstance = Container.get(tipoDispositivoServiceClass);
        Container.set("TipoDispositivoService", tipoDispositivoServiceInstance);
    });

    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('Criar Tipo de Dispositivo retorna JSON', async function() {
        // Arrange
        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };
        let bodyEsperado = {
            "idTipoDispositivo": 1,
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};
        let tipoDispositivoService = Container.get("TipoDispositivoService");
        sinon.stub(tipoDispositivoService, "criarTipoDispositivo").returns(Promise.resolve(Result.ok<ITipoDispositivoDTO>(bodyEsperado as ITipoDispositivoDTO)));

        let tipoDispositivoController = new TipoDispositivoController(tipoDispositivoService as ITipoDispositivoService);
        // Act
        await tipoDispositivoController.criarTipoDispositivo(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, bodyEsperado);
    });
    it('TipoDispositivoController + TipoDispositivoService teste de integração ao método criarTipoDispositivo', async function() {
        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };
        let bodyEsperado = {
            "idTipoDispositivo": 1,
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let tipoDispositivoProps = {
            tipoTarefa: [TipoTarefa.create(body.tipoTarefa[0]).getValue()],
            marca: Marca.create(body.marca).getValue(),
            modelo: Modelo.create(body.modelo).getValue(),
        };

        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps, IdTipoDispositivo.create(1).getValue()).getValue();

        let tipoDispositivoService = Container.get("TipoDispositivoService");
        const tipoDispositivoServiceSpy = sinon.spy(tipoDispositivoService, 'criarTipoDispositivo');

        let tipoDispositivoRepo = Container.get("TipoDispositivoRepo");

        sinon.stub(tipoDispositivoRepo, "getMaxId").returns(Promise.resolve(0));
        sinon.stub(tipoDispositivoRepo, "save").returns(Promise.resolve(tipoDispositivo));

        let tipoDispositivoController = new TipoDispositivoController(tipoDispositivoService as ITipoDispositivoService);
        await tipoDispositivoController.criarTipoDispositivo(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(tipoDispositivoServiceSpy);
        sinon.assert.calledWith(tipoDispositivoServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, bodyEsperado);
    });

    it('TipoDispositivoController + TipoDispositivoService + TipoDispositivoRepo teste de integração ao método criarTipoDispositivo', async function() {
        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };
        let bodyEsperado = {
            "idTipoDispositivo": 1,
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const tipoDispositivoPeristence = {
            idTipoDispositivo: 1,
            tipoTarefa: [body.tipoTarefa[0]],
            marca: body.marca,
            modelo: body.modelo,
        }

        let tipoDispositivoService = Container.get("TipoDispositivoService");
        let tipoDispositivoServiceSpy = sinon.spy(tipoDispositivoService, 'criarTipoDispositivo');
        let tipoDispositivoRepo = Container.get("TipoDispositivoRepo");
        let tipoDispositivoSchema = Container.get("TipoDispositivoSchema");

        sinon.stub(tipoDispositivoSchema, "find").returns(Promise.resolve([]));
        sinon.stub(tipoDispositivoSchema, "findOne").returns(Promise.resolve(null));
        sinon.stub(tipoDispositivoSchema, "create").returns(Promise.resolve(tipoDispositivoPeristence));

        let tipoDispositivoController = new TipoDispositivoController(tipoDispositivoService as ITipoDispositivoService);
        await tipoDispositivoController.criarTipoDispositivo(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(tipoDispositivoServiceSpy);
        sinon.assert.calledWith(tipoDispositivoServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, bodyEsperado);
    });

});
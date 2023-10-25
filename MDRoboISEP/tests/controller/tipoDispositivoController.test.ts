import * as sinon from 'sinon';
import Container from 'typedi';
import { Request, Response, NextFunction } from 'express';
import TipoDispositivoController from '../../src/controllers/TipoDispositivoController';
import ITipoDispositivoService from '../../src/services/IServices/ITipoDispositivoService';

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

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};
        let tipoDispositivoService = Container.get("TipoDispositivoService");
        sinon.stub(tipoDispositivoService, "criarTipoDispositivo").returns(Promise.resolve(body));

        let tipoDispositivoController = new TipoDispositivoController(tipoDispositivoService as ITipoDispositivoService);
        // Act
        await tipoDispositivoController.criarTipoDispositivo(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match.any);
    });
});
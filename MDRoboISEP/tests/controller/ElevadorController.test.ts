import * as sinon from 'sinon';
import 'mocha';
import "reflect-metadata";
import { expect } from "chai";
import { Container } from 'typedi';
import {NextFunction, Request, Response} from 'express';
import { Result } from '../../src/core/logic/Result';
import ICriarElevadorDTO from '../../src/dto/ICriarElevadorDTO';
import IElevadorService from '../../src/services/IServices/IElevadorService';
import ElevadorController from '../../src/controllers/ElevadorController';



describe('ElevadorController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        //this.timeout(10000);
        Container.reset();

        //Schema
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);
        
        //Repo
        let elevadorRepoClass = require('../../src/repos/ElevadorRepo').default;
        let elevadorRepoInstance = Container.get(elevadorRepoClass);
        Container.set("ElevadorRepo", elevadorRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        //Service
        let elevadorServiceClass = require('../../src/services/ElevadorService').default;
        let elevadorServiceInstance = Container.get(elevadorServiceClass);
        Container.set("ElevadorService", elevadorServiceInstance);


    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it ('criarElevador retorna elevador JSON', async function(){

        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
            "xCoord" : 0,
            "yCoord" : 0,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let req : Partial<Request> = {};
        req.body = body;

        let res:Partial<Response> =  {
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorServicoInstance = Container.get("ElevadorService");

        sinon.stub(elevadorServicoInstance, 'criarElevador').returns(Promise.resolve(Result.ok<ICriarElevadorDTO>(body as ICriarElevadorDTO)))

        const elevadorController = new ElevadorController(elevadorServicoInstance as IElevadorService)

        await elevadorController.criarElevador(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            edificio: "cod",
            pisosServidos: [1,2],
            xCoord : 0,
            yCoord : 0,
            orientacao: "norte",
            marca: "marca",
            modelo: "modelo",
            numeroSerie: "123",
            descricao: "desc"
        }));
    });
});
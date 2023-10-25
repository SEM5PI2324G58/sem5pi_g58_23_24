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
import { Codigo } from '../../src/domain/edificio/Codigo';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { Piso } from '../../src/domain/piso/Piso';
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { IdPonto } from '../../src/domain/ponto/IdPonto';
import { Ponto } from '../../src/domain/ponto/Ponto';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';



describe('ElevadorController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        
        Container.reset();

        let edificioProps2 : any = {
            nome: Nome.create('Edificio B').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio B').getValue(),
            listaPisos: [],
        };

        const edificioSemElevador = Edificio.create(edificioProps2,Codigo.create('ED02').getValue()).getValue();


        // Criar 2 pisos
        let pisosServidos: Piso[] = [];
        
        for (let i = 0; i < 2; i++){
            //Criar o mapa
            let pontoArray: Ponto[][] = []

            for(let j = 0 ; j<2 ; j++){
                pontoArray[j] = []
                for(let k = 0; k<2;k++){
                    let idPonto = IdPonto.create("ED01."+(k+j)+".1").getValue();
                    let tipoPonto = TipoPonto.create(" ").getValue();
                    let coordenadas = Coordenadas.create({abscissa: j , ordenada: k }).getValue();
                    let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
                    
                    pontoArray[j][k] = ponto;
                }
            }
                
    
            let piso = Piso.create({
                numeroPiso:  NumeroPiso.create(i+1).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: pontoArray,
            }, IdPiso.create(i+1).getValue()).getValue();

            // adicionar para a criação do elevador
            pisosServidos.push(piso);
            // adiconar ao edifício
        }
        edificioSemElevador.addPiso(pisosServidos[0]);
        edificioSemElevador.addPiso(pisosServidos[1]);
        
        Container.set("edificioSemElevador", edificioSemElevador)

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


    it ('Teste integração ElevadorController + ElevadorService criarElevador', async function(){

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

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let elevadorServiceInstance = Container.get("ElevadorService")

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));
        sinon.stub(elevadorRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        
        const elevadorServiceSpy = sinon.spy(elevadorServiceInstance,"criarElevador")
        const elevadorController = new ElevadorController(elevadorServiceInstance as IElevadorService)

        await elevadorController.criarElevador(<Request>req, <Response>res, <NextFunction>next);
        sinon.assert.calledOnce(elevadorServiceSpy)
        sinon.assert.calledWith(elevadorServiceSpy, body);
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
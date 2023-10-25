import * as sinon from 'sinon';
import 'mocha';
import "reflect-metadata";
import { expect } from "chai";
import { Container } from 'typedi';
import ElevadorService from '../../src/services/ElevadorService';
import IEdificioRepo from '../../src/services/IRepos/IEdificioRepo';
import IElevadorRepo from '../../src/services/IRepos/IElevadorRepo';
import ICriarElevadorDTO from '../../src/dto/ICriarElevadorDTO';
import { Nome } from '../../src/domain/edificio/Nome';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Ponto } from '../../src/domain/ponto/Ponto';
import { IdPonto } from '../../src/domain/ponto/IdPonto';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { Piso } from '../../src/domain/piso/Piso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Elevador } from '../../src/domain/elevador/Elevador';
import { IdElevador } from '../../src/domain/elevador/IdElevador';
import { DescricaoElevador } from '../../src/domain/elevador/DescricaoElevador';
import { MarcaElevador } from '../../src/domain/elevador/MarcaElevador';
import { ModeloElevador } from '../../src/domain/elevador/ModeloElevador';
import { NumeroSerieElevador } from '../../src/domain/elevador/NumeroSerieElevador';
import IPontoRepo from '../../src/services/IRepos/IPontoRepo';

describe('ElevadorService ', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
        // Criar edifício
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        
        const edificioComElevador = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        
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
        edificioComElevador.addPiso(pisosServidos[0]);
        edificioComElevador.addPiso(pisosServidos[1]);
        edificioSemElevador.addPiso(pisosServidos[0]);
        edificioSemElevador.addPiso(pisosServidos[1]);
        
        //Criar 4 pontos
        let pontos: Ponto[] = [];
        for (let i = 0; i < 4 ; i++ ){
            let idPonto = IdPonto.create("a.1."+ i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            pontos.push(Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue()) 
        }
        //Criar elevador
        let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();

        let elevador =  Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador).getValue()
        

        edificioComElevador.adicionarElevador(elevador);

        Container.set("edificioComElevador", edificioComElevador)
        Container.set("edificioSemElevador", edificioSemElevador)

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let elevadorRepoClass = require('../../src/repos/ElevadorRepo').default;
        let elevadorRepoInstance = Container.get(elevadorRepoClass);
        Container.set("ElevadorRepo", elevadorRepoInstance);

        let pontoRepoClass = require('../../src/repos/pontoRepo').default;
        let pontoRepoInstance = Container.get(pontoRepoClass);
        Container.set("PontoRepo", pontoRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('O edifício não existe', async () => {
        
        let body = {
            "edificio": "codNãoExiste",
            "pisosServidos": [1,2],
            "xCoord" : 0,
            "yCoord" : 0,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.criarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Edificio não existe.");

    });

    it('O edifício já tem um elevador', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [1,2],
            "xCoord" : 0,
            "yCoord" : 0,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.criarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Edificio já tem um elevador.");

    });

    it('A posição inserida não se encontra dentro dos limites do edifício', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [1,2],
            "xCoord" : 3,
            "yCoord" : 3,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));
        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.criarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("A posição do elevador não é válida para o edifício");

    });

    it('Os pisos inseridos não exitem no edifício', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [5,6],
            "xCoord" : 0,
            "yCoord" : 0,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));
        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo,  pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.criarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Foram inseridos pisos inválidos");

    });

    it('Elevador foi criado', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [1,2],
            "xCoord" : 0,
            "yCoord" : 0,
            "orientacao": "norte",
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));
        sinon.stub(elevadorRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        
        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo,  pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.criarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);

    });

});

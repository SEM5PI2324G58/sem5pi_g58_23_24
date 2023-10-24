import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPisoPersistence } from "../../src/dataschema/IPisoPersistence";
import { Piso } from "../../src/domain/piso/Piso";
import  ICriarPisoDTO  from '../../src/dto/ICriarPisoDTO';
import  {PisoMap}  from "../../src/mappers/PisoMap";
import IPisoRepo from "../../src/services/IRepos/IPisoRepo";
import PisoService from '../../src/services/PisoService';
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import IPontoRepo from "../../src/services/IRepos/IPontoRepo";
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


describe('PisoService ', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
    
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };

		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create("ED01.1.1").getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;

		let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(0).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: pontoArray,
        }, IdPiso.create(1).getValue()).getValue();


        
        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        edificio.addPiso(piso);

        Container.set("edificio", edificio)

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
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Existe edificio', async () => {
        


        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };


        let pisoRepoInstance = Container.get("PisoRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        const answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.errorValue()).to.equal("O edificio com o código as1 não existe");

    });


    it('Já existe o piso', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };

        let pisoRepoInstance = Container.get("PisoRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.errorValue()).to.equal("O piso numero 0 já existe");

    });

    it('Já existe o piso', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };

        let pisoRepoInstance = Container.get("PisoRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.errorValue()).to.equal("O piso numero 0 já existe");

    });

    it('Criar o piso com descrição nula', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        let pisoRepoInstance = Container.get("PisoRepo");

        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

    it('Criar o piso com descrição preenchida', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
            "descricaoPiso": "ola",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

    it('Criar o piso com descrição vazia', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
            "descricaoPiso": "",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo,pontoRepoInstance as IPontoRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

});

import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import EdificioService from '../../src/services/EdificioService';

import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import IEdificioDTO from "../../src/dto/IEdificioDTO";
import IListarEdMinEMaxPisosDTO from "../../src/dto/IListarEdMinEMaxPisosDTO";
import { Piso } from "../../src/domain/piso/Piso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { Ponto } from "../../src/domain/ponto/Ponto";
import { IdPonto } from "../../src/domain/ponto/IdPonto";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { IdPiso } from "../../src/domain/piso/IdPiso";


describe('EdificioService ', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
    
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Edifício já existe', async () => {
        
        let body = {
            "codigo": "as1",
            "dimensaoX": 3,
            "dimensaoY": 4,
        };

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        
        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificio));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.criarEdificio(body as IEdificioDTO);
        expect(answer.errorValue()).to.equal("Edificio já existe");
    });

    it('Criar o edifício com dimensão errada', async () => {
        
        let body = {
            "codigo": "as1",
            "dimensaoX": -1,
            "dimensaoY": 4,
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.criarEdificio(body as IEdificioDTO);
        expect(answer.errorValue()).to.equal("Erro: A Dimensão tem de ser válida e superior a 0");

    });

    it('Criar o edifício com código errado', async () => {
        
        let body = {
            "codigo": "*___*",
            "dimensaoX": 1,
            "dimensaoY": 4,
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.criarEdificio(body as IEdificioDTO);
        expect(answer.errorValue()).to.equal("Código do Edifício deve ser alfanumérico e pode conter espaços.");

    });

    it('Criar o edifício com nome errado', async () => {
        
        let body = {
            "codigo": "as1",
            "dimensaoX": 1,
            "dimensaoY": 4,
            "nome": "_",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.criarEdificio(body as IEdificioDTO);
        expect(answer.errorValue()).to.equal("Erro: O nome tem de ser válido, alfanumérico e ter até 50 caratéres.");

    });

    it('Criar o edifício com descricao errada', async () => {
        
        let body = {
            "codigo": "AG",
            "dimensaoX": 1,
            "dimensaoY": 4,
            "descricao": "_",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.criarEdificio(body as IEdificioDTO);
        expect(answer.errorValue()).to.equal("Erro: A descrição tem de ser válida e até 255 caratéres.");

    });

    it('Listar Edificios sem existirem edificios', async () => {
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificios();
        expect(answer.errorValue()).to.equal("Não existem edificios");
    });

    it('Listar Edificios com edificios existentes', async () => {
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };


        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificios();
        expect(answer.getValue()[0].nome).to.equal(edificioProps.nome.props.nome);
        expect(answer.getValue()[0].dimensaoX).to.equal(edificioProps.dimensao.props.x);
        expect(answer.getValue()[0].dimensaoY).to.equal(edificioProps.dimensao.props.y);
        expect(answer.getValue()[0].descricao).to.equal(edificioProps.descricao.props.descricao);
    });

    it('listarEdificioMinEMaxPisos com o numero minimo de pisos maior que o numero maximo', async () => {
        let body = {
            "minPisos": 2,
            "maxPisos": 1,
        };  
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.errorValue()).to.equal("O número mínimo de pisos não pode ser superior ao máximo");
    });

    
    it('listarEdificioMinEMaxPisos com o numero minimo e maximo de pisos é igual a 0', async () => {
        let body = {
            "minPisos": 0,
            "maxPisos": 0,
        };  
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.errorValue()).to.equal("O número mínimo e máximo de pisos não pode ser 0");
    });

    it('listarEdificioMinEMaxPisos com o numero minimo negativo', async () => {
        let body = {
            "minPisos": -1,
            "maxPisos": 0,
        };  
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.errorValue()).to.equal("O número mínimo e máximo de pisos não pode ser inferior a 0");
    });

    it('listarEdificioMinEMaxPisos com o numero maximo negativo', async () => {
        let body = {
            "minPisos": -7,
            "maxPisos": -5,
        };  
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([]));
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.errorValue()).to.equal("O número mínimo e máximo de pisos não pode ser inferior a 0");
    });

    it('listarEdificioMinEMaxPisos retorna edificio', async () => {
        let body = {
            "minPisos": 0,
            "maxPisos": 5,
        };  

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [Piso.create({numeroPiso: NumeroPiso.create(1).getValue(),
                                    descricaoPiso: DescricaoPiso.create("ola").getValue(),
                                    mapa: [[]]}, IdPiso.create(1).getValue()).getValue()],
                                
        };

        let edificioRepoInstance = Container.get("EdificioRepo");
        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));        
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.getValue()[0].nome).to.equal(edificioProps.nome.props.nome);
        expect(answer.getValue()[0].dimensaoX).to.equal(edificioProps.dimensao.props.x);
        expect(answer.getValue()[0].dimensaoY).to.equal(edificioProps.dimensao.props.y);
        expect(answer.getValue()[0].descricao).to.equal(edificioProps.descricao.props.descricao);
    });

    it('listarEdificioMinEMaxPisos retorna não existe edificios', async () => {
        let body = {
            "minPisos": 3,
            "maxPisos": 5,
        };  

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [Piso.create({numeroPiso: NumeroPiso.create(1).getValue(),
                                    descricaoPiso: DescricaoPiso.create("ola").getValue(),
                                    mapa: [[]]}, IdPiso.create(1).getValue()).getValue()],
                                
        };

        let edificioRepoInstance = Container.get("EdificioRepo");
        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));        
        const edificioService = new EdificioService(edificioRepoInstance as IEdificioRepo);
        let answer = await edificioService.listarEdificioMinEMaxPisos(body as IListarEdMinEMaxPisosDTO);
        expect(answer.errorValue()).to.equal("Não existem edificios com o número de pisos pretendido");

    });


});
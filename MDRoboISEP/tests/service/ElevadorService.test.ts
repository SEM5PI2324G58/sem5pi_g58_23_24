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
                    
                    let idPonto = IdPonto.create(1).getValue();
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
        
        //Criar array de pontos vazios
        let pontos: Ponto[] = [];
    
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
        Container.set("elevador", elevador)

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

    it('(Criar elevador) O edifício não existe', async () => {
        
        let body = {
            "edificio": "codNãoExiste",
            "pisosServidos": [1,2],
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

    it('(Criar elevador) O edifício já tem um elevador', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [1,2],
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

    it('(Criar elevador) Os pisos inseridos não existem no edifício', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [5,6],
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

    it('(Criar elevador) Elevador foi criado', async () => {
        
        let body = {
            "edificio": "Cod",
            "pisosServidos": [1,2],
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


    it('(Editar elevador) O edifício não existe', async () => {
        
        let body = {
            "edificio": "codNãoExiste",
            "pisosServidos": [1,2],
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
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Edificio não existe.");

    });

    it('(Editar elevador) O elevador não existe', async () => {
        
        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
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
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Elevador não existe.");

    });

    it('(Editar elevador) Os novos pisos são inválidos', async () => {
        
        let body = {
            "edificio": "cod",
            "pisosServidos": [10,20],
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
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.errorValue()).to.equal("Foram inseridos pisos inválidos");

    });


    it('(Editar elevador) Alterar a marca de um elevador tem sucesso ', async () => {
        
        let body = {
            "edificio": "cod",
            "marca": "marca"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);
    });

    it('(Editar elevador) Alterar o modelo de um elevador tem sucesso ', async () => {
        
        let body = {
            "edificio": "cod",
            "modelo": "modelo"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);
    });


    it('(Editar elevador) Alterar o número de série de um elevador tem sucesso ', async () => {
        
        let body = {
            "edificio": "cod",
            "numeroSerie": "numeroSerie"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);
    });

    it('(Editar elevador) Alterar a descrição de um elevador tem sucesso ', async () => {
        
        let body = {
            "edificio": "cod",
            "descricao": "descricao"
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);
    });

    it('(Editar elevador) Alterar os pisos de um elevador tem sucesso ', async () => {
        
        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2]
        };

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.editarElevador(body as ICriarElevadorDTO);
        expect(answer.getValue()).to.equal(body as ICriarElevadorDTO);
    });

    it('(Listar elevadores de um edifício) O edifício não existe', async () => {
        
        let edificio = "codNãoExiste";

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(null);

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.listarElevadoresDoEdificio(edificio);
        expect(answer.errorValue()).to.equal("Edifício não existe.");
    });

    it('(Listar elevadores de um edifício) O edifício não tem elevadores ', async () => {
        
        let edificio = "COD";

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        let answer = await elevadorService.listarElevadoresDoEdificio(edificio);
        expect(answer.errorValue()).to.equal("O edifício não tem elevadores.");
    });

    it('(Listar elevadores de um edifício) Listar elevadores de um edifício tem sucesso ', async () => {
        
        let edificio = "COD";

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pontoRepoInstance = Container.get("PontoRepo");

    
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(pontoRepoInstance, "save").returns(Promise.resolve(null))
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))

        const elevadorService = new ElevadorService(edificioRepoInstance as IEdificioRepo,elevadorRepoInstance as IElevadorRepo, pontoRepoInstance as IPontoRepo);
        
        let answer = (await elevadorService.listarElevadoresDoEdificio(edificio)).getValue();    
        expect(answer.id).to.equal(1);
        expect(answer.marca).to.equal('123');
        expect(answer.modelo).to.equal('123');
        expect(answer.numeroSerie).to.equal('123');
        expect(answer.descricao).to.equal('123');
    });
});

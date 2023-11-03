import { Response, Request, NextFunction } from 'express'; import * as sinon from 'sinon';
import Container from 'typedi';
import IPassagemDTO from '../../src/dto/IPassagemDTO';
import { Result } from '../../src/core/logic/Result';
import PassagemController from '../../src/controllers/PassagemController';
import IPassagemService from '../../src/services/IServices/IPassagemService';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { Elevador } from '../../src/domain/elevador/Elevador';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { Piso } from '../../src/domain/piso/Piso';
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { IdPonto } from '../../src/domain/ponto/IdPonto';
import { Ponto } from '../../src/domain/ponto/Ponto';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';
import { Passagem } from '../../src/domain/passagem/Passagem';
import IEdificioRepo from '../../src/services/IRepos/IEdificioRepo';
import IPassagemRepo from '../../src/services/IRepos/IPassagemRepo';
import { IPassagemPersistence } from '../../src/dataschema/IPassagemPersistence';


describe('PassagemController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function () {
        this.timeout(10000);
        Container.reset();

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let passagemServiceClass = require('../../src/services/PassagemService').default;
        let passagemServiceInstance = Container.get(passagemServiceClass);
        Container.set("PassagemService", passagemServiceInstance);
    });
    afterEach(function () {
        sinon.restore();
        sandbox.restore();
    });

    it('Criar passagem retorna passagem JSON', async function () {

        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => { };
        let passagemServiceInstance = Container.get("PassagemService");
        sinon.stub(passagemServiceInstance, 'criarPassagem').returns(Promise.resolve(Result.ok<IPassagemDTO>(body as IPassagemDTO)));

        let passagemController = new PassagemController(passagemServiceInstance as IPassagemService);

        // Act
        await passagemController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, body);
    });

    it('PassagemController + PassagemService integration test criar passagem', async function () {
        // Arrange	
        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: 1,
            abcissaA: 0,
            ordenadaA: 0,
            abcissaB: 0,
            ordenadaB: 0,
            orientacao: "Norte",
            codigoEdificioA: "COD1",
            codigoEdificioB: "COD2",
            numeroPisoA: 1,
            numeroPisoB: 2,
        }

        let data = await createAllData(metadata.codigoEdificioA, metadata.numeroPisoA, metadata.codigoEdificioB, metadata.numeroPisoB,
            metadata.abcissaA, metadata.ordenadaA, metadata.abcissaB, metadata.ordenadaB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;
        let stubPassagemRepo = sinon.stub(passagemRepo, 'findByDomainId');
        stubPassagemRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(passagemRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Passagem));
        stubRepo2 = sinon.stub(passagemRepo, 'getMaxId');
        stubRepo2.onCall(0).returns(Promise.resolve(1));
        let stubRepoo = sinon.stub(edificioRepo, 'save');
        stubRepoo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepoo.onCall(1).returns(Promise.resolve(edificioB));

        let passagemServiceInstance = Container.get("PassagemService");
        const passagemServiceSpy = sinon.spy(passagemServiceInstance, 'criarPassagem');

        const passagemController = new PassagemController(passagemServiceInstance as IPassagemService);

        // Act
        await passagemController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(passagemServiceSpy);
        sinon.assert.calledWith(passagemServiceSpy, body as IPassagemDTO);

    });

    it('PassagemController + PassagemService + PassagemRepo integração test criar passagem devolve passagem', async function () {
        // Arrange	
        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };


        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: 1,
            abcissaA: 0,
            ordenadaA: 0,
            abcissaB: 0,
            ordenadaB: 0,
            orientacao: "Norte",
            codigoEdificioA: "COD1",
            codigoEdificioB: "COD2",
            numeroPisoA: 1,
            numeroPisoB: 2,
        }



        let data = await createAllData(metadata.codigoEdificioA, metadata.numeroPisoA, metadata.codigoEdificioB, metadata.numeroPisoB,
            metadata.abcissaA, metadata.ordenadaA, metadata.abcissaB, metadata.ordenadaB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB
        const pisoA = data.getValue().pisoA
        const pisoB = data.getValue().pisoB
        const pontoA = data.getValue().pontoA
        const pontoB = data.getValue().pontoB
        const pontoC = data.getValue().pontoC
        const pontoD = data.getValue().pontoD

        let listaPontos: any[] = [];
        listaPontos.push(pontoA);
        listaPontos.push(pontoB);
        listaPontos.push(pontoC);
        listaPontos.push(pontoD);

        let passagemPersistence = {
            domainID: 1,
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        } as IPassagemPersistence;


        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        sinon.stub(passagemSchemaInstance, "create").returns(passagemPersistence as IPassagemPersistence);
        const repoStub = Container.get("PassagemRepo");
        const stub = sinon.stub(repoStub, 'getMaxId');
        stub.onCall(0).returns(Promise.resolve(1));
        const pisoRepo = Container.get("PisoRepo");
        const stubPisoRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubPisoRepo.onCall(0).returns(Promise.resolve(pisoA));
        stubPisoRepo.onCall(1).returns(Promise.resolve(pisoB));

        let passagemServiceInstance = Container.get("PassagemService");
        const passagemServiceSpy = sinon.spy(passagemServiceInstance, 'criarPassagem');

        const pisoController = new PassagemController(passagemServiceInstance as IPassagemService);

        await pisoController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);


        sinon.assert.calledOnce(passagemServiceSpy);
        sinon.assert.calledWith(passagemServiceSpy, body as IPassagemDTO);

    });


});

function createAllData(codigoEdificioA: string, numeroPisoA: number, codigoEdificioB: string,
    numeroPisoB: number, abcissaA: number, ordenadaA: number, abcissaB: number, ordenadaB: number): Promise<Result<any>> {

    // definir props
    interface edificioPropsA {
        nome?: Nome;
        dimensao: Dimensao;
        descricao?: DescricaoEdificio;
        listaPisos: Piso[];
        elevador?: Elevador;
    }
    interface pisoProps {
        numeroPiso: NumeroPiso;
        descricaoPiso: DescricaoPiso;
        mapa: Ponto[][];
    }
    interface pontoProps {
        coordenadas: Coordenadas;
        tipoPonto: TipoPonto;
    }
    interface coordenadaProps {
        abscissa: number;
        ordenada: number;
    }


    // criar props edificios
    let edificioPropsA: edificioPropsA = {
        nome: Nome.create("DEI").getValue(),
        dimensao: Dimensao.create(3, 3).getValue(),
        descricao: DescricaoEdificio.create("DEI").getValue(),
        listaPisos: [],
    }
    let edificiosPropsB = {
        nome: Nome.create("DEM").getValue(),
        dimensao: Dimensao.create(3, 3).getValue(),
        descricao: DescricaoEdificio.create("DEM").getValue(),
        listaPisos: [],
    }

    // criar codigos edificios
    let codigoEdificio = Codigo.create(codigoEdificioA).getValue();
    codigoEdificio = Codigo.create(codigoEdificioB).getValue();

    // criar edificios
    let edificioA = Edificio.create(edificioPropsA, codigoEdificio).getValue();
    let edificioB = Edificio.create(edificiosPropsB, codigoEdificio).getValue();

    // criar props pontos
    let coordenadasA: coordenadaProps = {
        abscissa: abcissaA,
        ordenada: ordenadaA,
    }
    let coordenadasB: coordenadaProps = {
        abscissa: abcissaB,
        ordenada: ordenadaB,
    }
    let coordenadasC: coordenadaProps = {
        abscissa: abcissaA,
        ordenada: ordenadaA + 1,
    }
    let coordenadasD: coordenadaProps = {
        abscissa: abcissaA + 1,
        ordenada: ordenadaA,
    }

    // criar props pontos
    let pontoPropsA: pontoProps = {
        coordenadas: Coordenadas.create(coordenadasA).getValue(),
        tipoPonto: TipoPonto.create("Norte").getValue(),
    }
    let pontoPropsB: pontoProps = {
        coordenadas: Coordenadas.create(coordenadasB).getValue(),
        tipoPonto: TipoPonto.create("Norte").getValue(),
    }
    let pontoPropsC: pontoProps = {
        coordenadas: Coordenadas.create(coordenadasC).getValue(),
        tipoPonto: TipoPonto.create("Norte").getValue(),
    }
    let pontoPropsD: pontoProps = {
        coordenadas: Coordenadas.create(coordenadasD).getValue(),
        tipoPonto: TipoPonto.create("Norte").getValue(),
    }

    // criar pontos
    let pontoA = Ponto.create(pontoPropsA).getValue();
    let pontoB = Ponto.create(pontoPropsB).getValue();
    let pontoC = Ponto.create(pontoPropsC).getValue();
    let pontoD = Ponto.create(pontoPropsD).getValue();

    // criar mapa
    let mapa: Ponto[][] = [];
    mapa.push([pontoA, pontoB]);
    mapa.push([pontoC, pontoD]);

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoA).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }
    let pisoPropsB: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoB).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 2").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA).getValue();
    let pisoB = Piso.create(pisoPropsB).getValue();

    // adicionar pisos aos edificios
    edificioA.addPiso(pisoA);
    edificioB.addPiso(pisoB);

    if (edificioA == null || edificioB == null || pisoA == null || pisoB == null || pontoA == null || pontoB == null
        || pontoC == null || pontoD == null) {
        return Promise.resolve(Result.fail<void>("Erro ao criar dados de test"));
    }

    return Promise.resolve(Result.ok<any>({
        "id": 2,
        "edificioA": edificioA,
        "edificioB": edificioB,
        "pisoA": pisoA,
        "pisoB": pisoB,
        "pontoA": pontoA,
        "pontoB": pontoB,
        "pontoC": pontoC,
        "pontoD": pontoD,
    }));

}
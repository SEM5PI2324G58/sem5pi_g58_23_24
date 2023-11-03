import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import PassagemService from '../../src/services/PassagemService';

import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { Ponto } from "../../src/domain/ponto/Ponto";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";
import { Piso } from "../../src/domain/piso/Piso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import IPassagemRepo from "../../src/services/IRepos/IPassagemRepo";
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import { Result } from "../../src/core/logic/Result";
import { Elevador } from "../../src/domain/elevador/Elevador";
import IPassagemDTO from "../../src/dto/IPassagemDTO";
import { Passagem } from "../../src/domain/passagem/Passagem";

describe('PassagemService ', () => {


    const sandbox = sinon.createSandbox();
    beforeEach(() => {

        Container.reset();

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Passagem criada com sucesso', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.isSuccess).to.equal(true);
    });

    it('Passagem já existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;
        let stubPassagemRepo = sinon.stub(passagemRepo, 'findByDomainId');
        stubPassagemRepo.onCall(0).returns(null);
        stubPassagemRepo.onCall(1).returns(edificioA);
        let stubRepo2 = sinon.stub(passagemRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Passagem));
        let stubRepo22 = sinon.stub(passagemRepo, 'getMaxId');
        stubRepo22.onCall(0).returns(Promise.resolve(1));
        let stubRepoo = sinon.stub(edificioRepo, 'save');
        stubRepoo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepoo.onCall(1).returns(Promise.resolve(edificioB));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("A passagem com o id " + body.id + " já existe")
    });

    it('Passagem não pode ser criada porque edificio não existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(null));
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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("Edificio A não existe")
    });

    it('Passagem não pode ser criada porque piso não existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 2,
            numeroPisoB: 2,
        }

        let data = await createAllData(body.codigoEdificioA, 1, body.codigoEdificioB, 1,);

        let edificioA = data.getValue().edificioA
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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("Piso A não existe")

    });

    
});


function createAllData(codigoEdificioA: string, numeroPisoA: any, codigoEdificioB: string,
    numeroPisoB: any): Promise<Result<any>> {

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

    // criar pontos
    let pontoA = undefined;
    let pontoB = undefined;
    let pontoC = undefined;
    let pontoD = undefined;

    // criar mapa
    let mapa: any[][] = [];
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

    if (edificioA == null || edificioB == null || pisoA == null || pisoB == null ) {
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

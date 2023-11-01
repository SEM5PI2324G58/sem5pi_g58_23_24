import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPassagemPersistence } from "../../src/dataschema/IPassagemPersistence";
import  IPassagemDTO  from '../../src/dto/IPassagemDTO';
import { PassagemMap } from "../../src/mappers/PassagemMap";
import PassagemRepo from "../../src/repos/PassagemRepo";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { Ponto } from "../../src/domain/ponto/Ponto";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";
import { Result } from "../../src/core/logic/Result";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { Piso } from "../../src/domain/piso/Piso";
import { Passagem } from "../../src/domain/passagem/Passagem";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";
import IPontoRepo from "../../src/services/IRepos/IPontoRepo";

describe('PassagemRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        
        Container.reset();

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);
        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);
        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        
        let pontoRepoClass = require('../../src/repos/PontoRepo').default;
        let pontoRepoInstance = Container.get(pontoRepoClass);
        Container.set("PontoRepo", pontoRepoInstance);
        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);
        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true', async () => {

        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        interface PassagemProps {
            listaPontos: Ponto[];
            pisoA: Piso;
            pisoB: Piso;
          }

        let body = {
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        } as PassagemProps

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");

        sinon.stub(passagemSchemaInstance, "findOne").returns(true);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.exists(passagem);
        expect(answer).to.be.true;
    });

    it('Save deve retornar passagem', async () => {

        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        let body = {
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        sinon.stub(passagemSchemaInstance, "create").returns(body as IPassagemPersistence);
        const repoStub = Container.get("PassagemRepo");
        const stub = sinon.stub(repoStub, 'getMaxId');
        stub.onCall(0).returns(Promise.resolve(1));
        const pisoRepo = Container.get("PisoRepo");
        const stubRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(pisoA));
        stubRepo.onCall(1).returns(Promise.resolve(pisoB));

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.save(passagem);
        expect(answer.id.toValue()).to.equal(passagem.id.toValue());
        expect(answer.props).to.equal(passagem.props);   
    });
 
    /*it('findByDomainId deve retornar passagem quando encontra', async () => {
    
        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();


        let pontoRepo = Container.get("PontoRepo") as IPontoRepo;
        let stubRepo3 = sinon.stub(pontoRepo, 'save');
        stubRepo3.onCall(0).returns(Promise.resolve(listaPontos[0]));
        stubRepo3.onCall(1).returns(Promise.resolve(listaPontos[1]));
        stubRepo3.onCall(2).returns(Promise.resolve(listaPontos[2]));
        stubRepo3.onCall(3).returns(Promise.resolve(listaPontos[3]));
        let pisoRepo = Container.get("PisoRepo");
        let stubRepoPiso = sinon.stub(pisoRepo, 'save').returns(Promise.resolve(pisoA));
        stubRepoPiso.onCall(0).returns(Promise.resolve(pisoA));
        stubRepoPiso.onCall(1).returns(Promise.resolve(pisoB));

        let body = {
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
    
        sinon.stub(passagemSchemaInstance, "findOne").returns(passagem);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.findByDomainId(id);
        expect(answer.id).to.equal(passagem.id);
        expect(answer.props).to.equal(passagem.props);
    });*/

    it('findByDomainId deve retornar null on fail', async () => {
    
        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        let body = {
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.findByDomainId(id);
        expect(answer).to.equal(null);

    });


    /*it('getMaxId deve retornar 2', async () => {

        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();
        let id2 = IdPassagem.create(2).getValue();

        let body = {
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }

        let passagem = Passagem.create(body, id).getValue();
        let passagem2 = Passagem.create(body,id2).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
       
        sinon.stub(passagemSchemaInstance, "find").returns([passagem,passagem2]);

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.getMaxId();
        expect(answer).to.equal(2);

    });*/

    it('getMaxId deve retornar 0', async () => {

        const passagemSchemaInstance = Container.get("PassagemSchema");
       
        sinon.stub(passagemSchemaInstance, "find").returns([]);

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.getMaxId();
        expect(answer).to.equal(0);

    });

});

function createAllData(): Promise<Result<any>> {

    interface pontoProps {
        coordenadas: Coordenadas;
        tipoPonto: TipoPonto;
    }
    interface coordenadaProps {
        abscissa: number;
        ordenada: number;
    }
    interface pisoProps {
        numeroPiso: NumeroPiso;
        descricaoPiso: DescricaoPiso;
        mapa: Ponto[][];
    }

    // criar props pontos
    let coordenadasA: coordenadaProps = {
        abscissa: 0,
        ordenada: 0,
    }
    let coordenadasB: coordenadaProps = {
        abscissa: 1,
        ordenada: 0,
    }
    let coordenadasC: coordenadaProps = {
        abscissa: 0,
        ordenada: 1,
    }
    let coordenadasD: coordenadaProps = {
        abscissa: 1,
        ordenada: 1,
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

    // criar lista de pontos
    let lista = [pontoA,pontoB,pontoC,pontoD]

    // criar mapa
    let mapa = [[pontoA,pontoB],[pontoC,pontoD]]

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(1).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }
    let pisoPropsB: pisoProps = {
        numeroPiso: NumeroPiso.create(1).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA).getValue();
    let pisoB = Piso.create(pisoPropsB).getValue();

    return Promise.resolve(Result.ok<any>({
        "listaPontos": lista,
        "pisoA": pisoA,
        "pisoB": pisoB,
    }));

}

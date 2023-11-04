import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPassagemPersistence } from "../../src/dataschema/IPassagemPersistence";
import SalaRepo from "../../src/repos/SalaRepo";
import { Ponto } from "../../src/domain/ponto/Ponto";
import { Result } from "../../src/core/logic/Result";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { Piso } from "../../src/domain/piso/Piso";
import { Passagem } from "../../src/domain/passagem/Passagem";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import IPontoRepo from "../../src/services/IRepos/IPontoRepo";
import { Document } from 'mongoose';
import { Sala } from "../../src/domain/sala/Sala";
import CategorizacaoSala from "../../src/domain/sala/CategorizacaoSala";
import DescricaoSala from "../../src/domain/sala/DescricaoSala";
import NomeSala from "../../src/domain/sala/NomeSala";
import { ISalaPersistence } from "../../src/dataschema/ISalaPersistence";


describe('PassagemRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(10000);
        Container.reset();

        let salaSchemaInstance = require('../../src/persistence/schemas/SalaSchema').default;
        Container.set("SalaSchema", salaSchemaInstance);
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
        let salaRepoClass = require('../../src/repos/SalaRepo').default;
        let salaRepoInstance = Container.get(salaRepoClass);
        Container.set("SalaRepo", salaRepoInstance);

    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true', async function () {

        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;

        let id = NomeSala.create("B300").getValue();

        interface SalaProps {
            categoria: CategorizacaoSala;
            descricao?: DescricaoSala;
            piso: Piso;
            listaPontos: Ponto[];
          }

        let body = {
            categoria: CategorizacaoSala.create("Laboratorio").getValue(),
            descricao: DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue(),
            piso: pisoA,
            listaPontos: listaPontos,
        } as SalaProps;

        let sala = Sala.create(body, id).getValue();

        const salaSchemaInstance = Container.get("SalaSchema");

        sinon.stub(salaSchemaInstance, "findOne").returns(true);
        const salaRepo = new SalaRepo(salaSchemaInstance as any);
        const answer = await salaRepo.exists(sala);
        expect(answer).to.be.true;
    });

    it('Save deve retornar sala', async function () {

        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;

        let id = NomeSala.create("B300").getValue();

        interface SalaProps {
            categoria: CategorizacaoSala;
            descricao: DescricaoSala;
            piso: Piso;
            listaPontos: Ponto[];
          }

        let body = {
            categoria: CategorizacaoSala.create("Laboratorio").getValue(),
            descricao: DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue(),
            piso: pisoA,
            listaPontos: listaPontos,
        } as SalaProps;

        let salaPersistence = {
            domainID: id.toValue(),
            categoria: body.categoria.props.categorizacao.toString(),
            descricao: body.descricao.props.descricao.toString(),
            piso: pisoA,
            listaPontos: listaPontos,
            save() { return this; }
        } as unknown as ISalaPersistence & Document<any, any, any>;

        let sala = Sala.create(body, id).getValue();

        const salaSchemaInstance = Container.get("SalaSchema");
        sinon.stub(salaSchemaInstance, "findOne").returns(null);
        sinon.stub(salaSchemaInstance, "create").returns(salaPersistence as ISalaPersistence);
        const pisoRepo = Container.get("PisoRepo");
        const stubRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(pisoA));

        const salaRepo = new SalaRepo(salaSchemaInstance as any);
        const answer = await salaRepo.save(sala);
        expect(answer.id.toValue()).to.equal(sala.id.toValue());
        expect(answer.props.listaPontos.length).to.equal(sala.props.listaPontos.length);
        expect(answer.props.piso.returnNumeroPiso()).to.equal(sala.props.piso.returnNumeroPiso());
        expect(answer.props.categoria.props.categorizacao).to.equal(sala.props.categoria.props.categorizacao);
        expect(answer.props.descricao?.props.descricao).to.equal(sala.props.descricao?.props.descricao);
    });
 
    it('findByDomainId deve retornar sala quando encontra', async () => {
    
        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;

        let id = NomeSala.create("B300").getValue();

        interface SalaProps {
            categoria: CategorizacaoSala;
            descricao?: DescricaoSala;
            piso: Piso;
            listaPontos: Ponto[];
          }

        let body = {
            categoria: CategorizacaoSala.create("Laboratorio").getValue(),
            descricao: DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue(),
            piso: pisoA,
            listaPontos: listaPontos,
        } as SalaProps;

        let sala = Sala.create(body, id).getValue();

        const salaSchemaInstance = Container.get("SalaSchema");
    
        sinon.stub(salaSchemaInstance, "findOne").returns(sala);
        const salaRepo = new SalaRepo(salaSchemaInstance as any);
        const answer = await salaRepo.findByDomainId(id);
        expect(answer.id.toValue()).to.equal(sala.id.toValue());
        expect(answer.props.listaPontos.length).to.equal(sala.props.listaPontos.length);
        expect(answer.props.piso.returnNumeroPiso()).to.equal(sala.props.piso.returnNumeroPiso());
        expect(answer.props.categoria.props.categorizacao).to.equal(sala.props.categoria.props.categorizacao);
        expect(answer.props.descricao?.props.descricao).to.equal(sala.props.descricao?.props.descricao);
    });

    it('findByDomainId deve retornar null on fail', async function () {
    
        const data = await createAllData();
        let listaPontos = data.getValue().listaPontos;
        let pisoA = data.getValue().pisoA;

        let id = NomeSala.create("B300").getValue();

        interface SalaProps {
            categoria: CategorizacaoSala;
            descricao?: DescricaoSala;
            piso: Piso;
            listaPontos: Ponto[];
          }

        let body = {
            categoria: CategorizacaoSala.create("Laboratorio").getValue(),
            descricao: DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue(),
            piso: pisoA,
            listaPontos: listaPontos,
        } as SalaProps;

        const salaSchemaInstance = Container.get("SalaSchema");
        sinon.stub(salaSchemaInstance, "findOne").returns(null);
        const salaRepo = new SalaRepo(salaSchemaInstance as any);
        const answer = await salaRepo.findByDomainId(id);
        expect(answer).to.equal(null);

    });

});

function createAllData(): Promise<Result<any>> {

    interface pisoProps {
        numeroPiso: NumeroPiso;
        descricaoPiso: DescricaoPiso;
        mapa: Ponto[][];
    }

    // criar pontos
    let pontoA = undefined;
    let pontoB = undefined;

    // criar lista de pontos
    let lista = [pontoA,pontoB]

    // criar mapa
    let mapa = [[pontoA,pontoB],[pontoA,pontoB]]

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(1).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa as any,
    }
    // criar pisos
    let pisoA = Piso.create(pisoPropsA,IdPiso.create(1).getValue()).getValue();

    return Promise.resolve(Result.ok<any>({
        "listaPontos": lista,
        "pisoA": pisoA,
    }));

}

import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPisoPersistence } from "../../src/dataschema/IPisoPersistence";
import  IPisoDTO  from '../../src/dto/IPisoDTO';
import { PisoMap } from "../../src/mappers/PisoMap";
import PisoRepo from "../../src/repos/PisoRepo";

describe('PisoRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        
        Container.reset();

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true', async () => {

    
        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: []
        } as IPisoPersistence;

        const pisoSchemaInstance = Container.get("PisoSchema");

        sinon.stub(pisoSchemaInstance, "findOne").returns(true);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.exists(await PisoMap.toDomain(pisoDTO));
        expect(answer).to.be.true;
    });

    it('Save deve retornar piso', async () => {

        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: []
        } as IPisoPersistence;

        const pisoSchemaInstance = Container.get("PisoSchema");
        const piso = await PisoMap.toDomain(pisoDTO);
        sinon.stub(pisoSchemaInstance, "findOne").returns(null);
        sinon.stub(pisoSchemaInstance, "create").returns(pisoDTO as IPisoPersistence);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.save(piso);
        expect(answer.returnIdPiso()).to.equal(piso.returnIdPiso());
        expect(answer.returnNumeroPiso()).to.equal(piso.returnNumeroPiso());
        expect(answer.returnDescricaoPiso()).to.equal(piso.returnDescricaoPiso());
        expect(answer.returnListaDeIdDosPontos()).to.equal(piso.returnListaDeIdDosPontos());
        
    });



    it('Save deve retornar piso ao editar', async () => {

    
        const pisoDTO1 = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: [],
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;

        const pisoDTO2 = {
            domainID: 1,
            numeroPiso: 2,
            descricaoPiso: "Oas",
            pontos: []
        } as IPisoPersistence;

        const pisoSchemaInstance = Container.get("PisoSchema");
        const piso = await PisoMap.toDomain(pisoDTO2);
       
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoDTO1);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.save(piso);
        expect(answer.returnIdPiso()).to.equal(piso.returnIdPiso());
        expect(answer.returnNumeroPiso()).to.equal(piso.returnNumeroPiso());
        expect(answer.returnDescricaoPiso()).to.equal(piso.returnDescricaoPiso());
        expect(answer.returnListaDeIdDosPontos()).to.equal(piso.returnListaDeIdDosPontos());

    });
 
    it('findByDomainId deve retornar piso quando encontra', async () => {

    
        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: [],
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;


        const pisoSchemaInstance = Container.get("PisoSchema");
        const piso = await PisoMap.toDomain(pisoDTO);
    
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoDTO);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.findByDomainId(pisoDTO.domainID);
        expect(answer.returnIdPiso()).to.equal(piso.returnIdPiso());
        expect(answer.returnNumeroPiso()).to.equal(piso.returnNumeroPiso());
        expect(answer.returnDescricaoPiso()).to.equal(piso.returnDescricaoPiso());
        expect(answer.returnListaDeIdDosPontos()).to.equal(piso.returnListaDeIdDosPontos());

    });

    it('findByDomainId deve retornar nulo or fail quando nãp encontra', async () => {

    
        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: [],
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;


        const pisoSchemaInstance = Container.get("PisoSchema");
        const piso = await PisoMap.toDomain(pisoDTO);
    
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoDTO);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.findByDomainId(pisoDTO.domainID);
        expect(answer.returnIdPiso()).to.equal(piso.returnIdPiso());
        expect(answer.returnNumeroPiso()).to.equal(piso.returnNumeroPiso());
        expect(answer.returnDescricaoPiso()).to.equal(piso.returnDescricaoPiso());
        expect(answer.returnListaDeIdDosPontos()).to.equal(piso.returnListaDeIdDosPontos());

    });

    it('findByDomainId deve retornar null on fail', async () => {

    
        const pisoDTO = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
            pontos: [],
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;


        const pisoSchemaInstance = Container.get("PisoSchema");
        const piso = await PisoMap.toDomain(pisoDTO);
       
        sinon.stub(pisoSchemaInstance, "findOne").returns(null);
        const pisoRepo = new PisoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.findByDomainId(pisoDTO.domainID);
        expect(answer).to.equal(null);

    });

});

import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import EdificioService from '../../src/services/EdificioService';
import TipoDispositivoService from "../../src/services/TipoDispositivoService";
import ITipoDispositivoDTO from "../../src/dto/ITipoDispositivoDTO";
import ITipoDispositivoRepo from "../../src/services/IRepos/ITipoDispositivoRepo";

import "reflect-metadata";

import 'mocha';
import { TipoDispositivo } from "../../src/domain/tipoDispositivo/TipoDispositivo";
import { TipoTarefa } from "../../src/domain/tipoDispositivo/TipoTarefa";
import { Marca } from "../../src/domain/tipoDispositivo/Marca";
import { Modelo } from "../../src/domain/tipoDispositivo/Modelo";
import { IdTipoDispositivo } from "../../src/domain/tipoDispositivo/IdTipoDispositivo";

describe('Tipo Dispositivo Service ', () => {

    const sandbox = sinon.createSandbox();
    
    beforeEach(function() {
        Container.reset();
        this.timeout(10000);
        let tipoDispositivoSchema = require('../../src/persistence/schemas/TipoDispositivoSchema').default;
        Container.set("TipoDispositivoSchema", tipoDispositivoSchema);

        let tipoDispositivoRepoClass = require('../../src/repos/TipoDispositivoRepo').default;
        let tipoDispositvoRepoInstance = Container.get(tipoDispositivoRepoClass);
        Container.set("TipoDispositivoRepo", tipoDispositvoRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });


    it('Criar tipo de dispositivo com sucesso', async () => {

        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "as1",
        };

        let tipoDispositivoProps = {
            tipoTarefa: [TipoTarefa.create(body.tipoTarefa[0]).getValue()],
            marca: Marca.create(body.marca).getValue(),
            modelo: Modelo.create(body.modelo).getValue(),
        };

        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        let tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps, IdTipoDispositivo.create(3).getValue()).getValue();

        sinon.stub(tipoDispositivoRepoInstance, "getMaxId").returns(Promise.resolve(2));
        sinon.stub(tipoDispositivoRepoInstance, "save").returns(Promise.resolve(tipoDispositivo));

        const tipoDispositivoService = new TipoDispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo);

        let answer = await tipoDispositivoService.criarTipoDispositivo(body as ITipoDispositivoDTO);
        expect(answer.getValue().tipoTarefa[0]).to.equal(body.tipoTarefa[0]);
        expect(answer.getValue().marca).to.equal(body.marca);
        expect(answer.getValue().modelo).to.equal(body.modelo);

    });

    it('Criar tipo de dispositivo com marca incorreta', async () => {
        
        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "_______",
            "modelo": "as1",
        };
        
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        sinon.stub(tipoDispositivoRepoInstance, "getMaxId").returns(Promise.resolve(2));
        const tipoDispositivoService = new TipoDispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo);
        let answer = await tipoDispositivoService.criarTipoDispositivo(body as ITipoDispositivoDTO);
        expect(answer.errorValue()).to.equal("Erro: A marca tem de ser válida e ter até 50 caratéres.");
    });

    it('Criar tipo de dispositivo com modelo incorreto', async () => {
        
        let body = {
            "tipoTarefa": ["Vigilancia"],
            "marca": "as1",
            "modelo": "_________",
        };
        
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        sinon.stub(tipoDispositivoRepoInstance, "getMaxId").returns(Promise.resolve(2));
        const tipoDispositivoService = new TipoDispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo);
        let answer = await tipoDispositivoService.criarTipoDispositivo(body as ITipoDispositivoDTO);
        expect(answer.errorValue()).to.equal("Erro: O modelo tem de ser válido e ter até 100 caratéres.");
    });

    it('Criar tipo de dispositivo com tipo de tarefa incorreto', async () => {
        let body = {
            "tipoTarefa" : ["Erro"],
            "marca": "as1",
            "modelo": "as1"
        };

        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        sinon.stub(tipoDispositivoRepoInstance, "getMaxId").returns(Promise.resolve(2));
        const tipoDispositivoService = new TipoDispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo);
        let answer = await tipoDispositivoService.criarTipoDispositivo(body as ITipoDispositivoDTO);
        expect(answer.errorValue()).to.equal("Erro: O tipo de tarefa não é válido.");
    });

});
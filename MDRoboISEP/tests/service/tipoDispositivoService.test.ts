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
import TipoDispositivoService from "../../src/services/TipoDispositivoService";
import ITipoDispositivoDTO from "../../src/dto/ITipoDispositivoDTO";
import ITipoDispositivoRepo from "../../src/services/IRepos/ITipoDispositivoRepo";

import "reflect-metadata";
import {Response, Request, NextFunction} from 'express';
import { Result }  from '../../src/core/logic/Result';
import PisoController from '../../src/controllers/PisoController';
import IPisoService from '../../src/services/IServices/IPisoService';
import  ICriarPisoDTO  from '../../src/dto/ICriarPisoDTO';
import { IPisoPersistence } from "../../src/dataschema/IPisoPersistence";
import { IEdificioPersistence } from "../../src/dataschema/IEdificioPersistence";
import { IPontoPersistence } from "../../src/dataschema/IPontoPersistence";

import 'mocha';
import { PisoMap } from "../../src/mappers/PisoMap";
import { Piso } from "../../src/domain/piso/Piso";
import {DescricaoPiso} from '../../src/domain/piso/DescricaoPiso'
import {NumeroPiso} from '../../src/domain/piso/NumeroPiso'
import {IdPiso} from '../../src/domain/piso/IdPiso'
import {Ponto} from '../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../src/domain/ponto/IdPonto';

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
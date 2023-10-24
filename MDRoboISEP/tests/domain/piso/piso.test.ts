import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {Piso} from '../../../src/domain/piso/Piso'
import {DescricaoPiso} from '../../../src/domain/piso/DescricaoPiso'
import {NumeroPiso} from '../../../src/domain/piso/NumeroPiso'
import {IdPiso} from '../../../src/domain/piso/IdPiso'
import {Ponto} from '../../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import * as assert from 'assert';


describe('piso domain', function () {

	it('piso é criado com sucesso', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create("b.1.1").getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;

		let pisoOuErro = await Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: descricaoPiso,
            mapa: pontoArray,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isSuccess, true);
	});

	
});



import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {Piso} from '../../../src/domain/piso/Piso'

import {Ponto} from '../../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import * as assert from 'assert';


describe('ponto domain', function () {

	it('ponto é criado com sucesso', async function () {
		// Arrange
		let idPonto = IdPonto.create("b.1.1").getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto);

		assert.strictEqual(ponto.isSuccess, true);
	});

	it('toElevador muda o tipo de ponto para o tipo "Elevador"', async function () {
		// Arrange
		let idPonto = IdPonto.create("b.1.1").getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toElevador();

		assert.strictEqual(ponto.returnTipoPonto(), "Elevador");
	});
});


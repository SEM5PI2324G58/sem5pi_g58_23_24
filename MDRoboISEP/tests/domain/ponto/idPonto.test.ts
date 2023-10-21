import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {IdPonto} from '../../../src/domain/ponto/IdPonto'
import * as assert from 'assert';


describe('IdPonto domain', function () {

	it('IdPonto é criado com uma string no formato xx.nn.nn', async function () {
		// Arrange
		let descricaoPiso = IdPonto.create("Az1.1.12");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('IdPonto é criado com uma string no formato x x.-nn.nn', async function () {
		// Arrange
		let descricaoPiso = IdPonto.create("A z1.1.12");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('IdPonto não é criado com uma string com o formato ..', async function () {
		// Arrange
		let descricaoPiso = IdPonto.create("..");
		assert.strictEqual(descricaoPiso.isFailure, true);
	});

    it('IdPonto não é criado com uma string com o formato xx.xx.nn', async function () {
		// Arrange
		let descricaoPiso = IdPonto.create("asd1.as1.1");
		assert.strictEqual(descricaoPiso.isFailure, true);
	});

});
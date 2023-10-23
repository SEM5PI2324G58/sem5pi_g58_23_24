import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {TipoPonto} from '../../../src/domain/ponto/TipoPonto'
import * as assert from 'assert';


describe('TipoPonto domain', function () {

	it('TipoPonto é criado com uma string vazia', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create(" ");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "Norte"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("Norte");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "Elevador"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("Elevador");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});


    it('TipoPonto é criado com uma string "Oeste"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("Oeste");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "NorteOeste"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("NorteOeste");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaNorte"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("PortaNorte");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaOeste"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("PortaOeste");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaNorteOeste"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("PortaNorteOeste");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});


    it('TipoPonto não é criado com uma string "ola"', async function () {
		// Arrange
		let descricaoPiso = TipoPonto.create("ola");
		assert.strictEqual(descricaoPiso.isFailure, true);
	});

});

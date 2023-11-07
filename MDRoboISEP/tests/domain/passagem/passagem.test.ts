import 'reflect-metadata';

import { Passagem } from '../../../src/domain/passagem/Passagem'
import { IdPassagem } from '../../../src/domain/passagem/IdPassagem'
import { Ponto } from '../../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import * as assert from 'assert';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Piso } from '../../../src/domain/piso/Piso';

async function newDummyPonto(x: number, y: number, id: number) {
	let idPonto = IdPonto.create(id).getValue();
	let tipoPonto = TipoPonto.create(" ").getValue();
	let coordenadas = Coordenadas.create({ abscissa: x, ordenada: y }).getValue();
	return Ponto.create({ coordenadas: coordenadas, tipoPonto: tipoPonto }, idPonto).getValue();
}
describe('passagem domain', function () {

	it('passagem é criado com sucesso', async function () {
		let idPassagem = IdPassagem.create(1).getValue();
		let pontoArray: Ponto[] = [];
		let ponto = await newDummyPonto(0, 0, 1);
		pontoArray[0] = ponto;
		ponto = await newDummyPonto(1, 1, 2);
		pontoArray[1] = ponto;
		ponto = await newDummyPonto(2, 2, 3);
		pontoArray[2] = ponto;
		ponto = await newDummyPonto(3, 3, 4);
		pontoArray[3] = ponto;

		let pontoMatriz: Ponto[][] = [];
		pontoMatriz[0] = pontoArray;
		let mapa;
		let pisoA = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(1).getValue()
		).getValue();

		let pisoB = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let passagemOuErro = Passagem.create({
			listaPontos: pontoArray,
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.isSuccess, true);
	});

	it('passagem não é criado com 3 pontos', async function () {
		let idPassagem = IdPassagem.create(1).getValue();
		let pontoArray: Ponto[] = [];
		let ponto = await newDummyPonto(0, 0, 1);
		pontoArray[0] = ponto;
		ponto = await newDummyPonto(1, 1, 2);
		pontoArray[1] = ponto;
		ponto = await newDummyPonto(2, 2, 3);
		pontoArray[2] = ponto;

		let pontoMatriz: Ponto[][] = [];
		pontoMatriz[0] = pontoArray;
		let mapa;
		let pisoA = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(1).getValue()
		).getValue();

		let pisoB = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let passagemOuErro = Passagem.create({
			listaPontos: pontoArray,
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.errorValue(), "listaPontos deve ter um tamanho igual a 4.");
	});

	it('passagem não é criado com pisoA undefined', async function () {
		let idPassagem = IdPassagem.create(1).getValue();
		let pontoArray: Ponto[] = [];
		let ponto = await newDummyPonto(0, 0, 1);
		pontoArray[0] = ponto;
		ponto = await newDummyPonto(1, 1, 2);
		pontoArray[1] = ponto;
		ponto = await newDummyPonto(2, 2, 3);
		pontoArray[2] = ponto;
		ponto = await newDummyPonto(3, 3, 4);
		pontoArray[3] = ponto;

		let pontoMatriz: Ponto[][] = [];
		pontoMatriz[0] = pontoArray;
		let mapa;
		let pisoB = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let pisoA : Piso;

		let passagemOuErro = Passagem.create({
			listaPontos: pontoArray,
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.errorValue(), "pisoA is null or undefined");
	} 
	
	);

	it('passagem não é criado com pisoA undefined', async function () {
		let idPassagem = IdPassagem.create(1).getValue();
		let pontoArray: Ponto[] = [];
		let ponto = await newDummyPonto(0, 0, 1);
		pontoArray[0] = ponto;
		ponto = await newDummyPonto(1, 1, 2);
		pontoArray[1] = ponto;
		ponto = await newDummyPonto(2, 2, 3);
		pontoArray[2] = ponto;
		ponto = await newDummyPonto(3, 3, 4);
		pontoArray[3] = ponto;

		let pontoMatriz: Ponto[][] = [];
		pontoMatriz[0] = pontoArray;
		let mapa;
		let pisoA = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let pisoB : Piso;

		let passagemOuErro = Passagem.create({
			listaPontos: pontoArray,
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.errorValue(), "pisoB is null or undefined");
	}

	);

});
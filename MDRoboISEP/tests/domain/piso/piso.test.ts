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
import { Container } from 'typedi';

describe('piso domain', function () {

	beforeEach(function() {
        
        Container.reset();

		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let pontoArray  : Ponto[][] = [];
		pontoArray[0] = [];
		pontoArray[1] = [];
		pontoArray[2] = [];

		let idPonto00 = IdPonto.create(1).getValue();
		let tipoPonto00 = TipoPonto.create("NorteOeste").getValue();
		let coordenadas00 = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto00 = Ponto.create({coordenadas: coordenadas00,tipoPonto:tipoPonto00},idPonto00).getValue();

		pontoArray[0][0] = ponto00;

		let idPonto01 = IdPonto.create(2).getValue();
		let tipoPonto01 = TipoPonto.create("Norte").getValue();
		let coordenadas01 = Coordenadas.create({abscissa: 0 , ordenada: 1 }).getValue();
		let ponto01 = Ponto.create({coordenadas: coordenadas01,tipoPonto:tipoPonto01},idPonto01).getValue();

		pontoArray[0][1] = ponto01;

		let idPonto02 = IdPonto.create(3).getValue();
		let tipoPonto02 = TipoPonto.create("Oeste").getValue();
		let coordenadas02 = Coordenadas.create({abscissa: 0 , ordenada: 2 }).getValue();
		let ponto02 = Ponto.create({coordenadas: coordenadas02,tipoPonto:tipoPonto02},idPonto02).getValue();

		pontoArray[0][2] = ponto02;

		let idPonto10 = IdPonto.create(4).getValue();
		let tipoPonto10 = TipoPonto.create("Oeste").getValue();
		let coordenadas10 = Coordenadas.create({abscissa: 1 , ordenada: 0 }).getValue();
		let ponto10 = Ponto.create({coordenadas: coordenadas10,tipoPonto:tipoPonto10},idPonto10).getValue();

		pontoArray[1][0] = ponto10;

		let idPonto11 = IdPonto.create(5).getValue();
		let tipoPonto11 = TipoPonto.create(" ").getValue();
		let coordenadas11 = Coordenadas.create({abscissa: 1 , ordenada: 1 }).getValue();
		let ponto11 = Ponto.create({coordenadas: coordenadas11,tipoPonto:tipoPonto11},idPonto11).getValue();

		pontoArray[1][1] = ponto11;

		let idPonto12 = IdPonto.create(6).getValue();
		let tipoPonto12 = TipoPonto.create("Oeste").getValue();
		let coordenadas12 = Coordenadas.create({abscissa: 1 , ordenada: 2 }).getValue();
		let ponto12 = Ponto.create({coordenadas: coordenadas12,tipoPonto:tipoPonto12},idPonto12).getValue();

		pontoArray[1][2] = ponto12;

		let idPonto20 = IdPonto.create(7).getValue();
		let tipoPonto20 = TipoPonto.create("Norte").getValue();
		let coordenadas20 = Coordenadas.create({abscissa: 2 , ordenada: 0 }).getValue();
		let ponto20 = Ponto.create({coordenadas: coordenadas20,tipoPonto:tipoPonto20},idPonto20).getValue();

		pontoArray[2][0] = ponto20;

		let idPonto21 = IdPonto.create(8).getValue();
		let tipoPonto21 = TipoPonto.create("Norte").getValue();
		let coordenadas21 = Coordenadas.create({abscissa: 2 , ordenada: 1 }).getValue();
		let ponto21 = Ponto.create({coordenadas: coordenadas21,tipoPonto:tipoPonto21},idPonto21).getValue();

		pontoArray[2][1] = ponto21;

		let idPonto22 = IdPonto.create(9).getValue();
		let tipoPonto22 = TipoPonto.create("Norte").getValue();
		let coordenadas22 = Coordenadas.create({abscissa: 2 , ordenada: 2 }).getValue();
		let ponto22 = Ponto.create({coordenadas: coordenadas22,tipoPonto:tipoPonto22},idPonto22).getValue();

		pontoArray[2][2] = ponto22;

		let piso = Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: descricaoPiso,
            mapa: pontoArray,
        }, idPiso).getValue();
        
		Container.set('piso2x2',piso);

    });

	it('piso é criado com sucesso com descrição', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create(1).getValue();
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


	it('piso é criado com sucesso sem descricao', async function () {
		// Arrange
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;
		let descricao = null;
		let pisoOuErro = await Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: null,
            mapa: pontoArray,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isSuccess, true);
	});

	it('piso não é criado sem numeroPiso', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let pontoArray  : Ponto[][] = [];
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
		pontoArray[0] = []
		pontoArray[0][0] = ponto;
		let pisoOuErro = await Piso.create({
            numeroPiso: null,
            descricaoPiso: descricaoPiso,
            mapa: pontoArray,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	it('elevador removido 0,0 0,1 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[0][0].toElevador();
		piso.props.mapa[0][1].toElevador();
		
		piso.reverterElevadorNoMapa([0,0,0,1]);

		assert.strictEqual(piso.props.mapa[0][0].returnTipoPonto(), "NorteOeste");
		assert.strictEqual(piso.props.mapa[0][1].returnTipoPonto(), "Oeste");
	});


	it('elevador removido 1,0 1,1 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[1][0].toElevador();
		piso.props.mapa[1][1].toElevador();
		
		piso.reverterElevadorNoMapa([1,0,1,1]);

		assert.strictEqual(piso.props.mapa[1][0].returnTipoPonto(), "Norte");
		assert.strictEqual(piso.props.mapa[1][1].returnTipoPonto(), " ");
	});

	it('elevador removido 2,1 2,2 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[2][1].toElevador();
		piso.props.mapa[2][2].toElevador();
		
		piso.reverterElevadorNoMapa([2,1,2,2]);

		assert.strictEqual(piso.props.mapa[2][1].returnTipoPonto(), "Oeste");
		assert.strictEqual(piso.props.mapa[2][2].returnTipoPonto(), " ");
	});


	
});



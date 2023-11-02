import 'reflect-metadata';
import * as assert from 'assert';
import {expect} from 'chai';
import { DescricaoElevador } from '../../../src/domain/elevador/DescricaoElevador';
import { ModeloElevador } from '../../../src/domain/elevador/ModeloElevador';
import { MarcaElevador } from '../../../src/domain/elevador/MarcaElevador';
import {NumeroSerieElevador } from '../../../src/domain/elevador/NumeroSerieElevador';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { Ponto } from '../../../src/domain/ponto/Ponto';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Piso } from '../../../src/domain/piso/Piso';
import {Elevador} from '../../../src/domain/elevador/Elevador'
import { IdElevador } from '../../../src/domain/elevador/IdElevador';



describe('Elevador domain', function () {

	it('Elevador é criado com sucesso', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Criar array de pontos vazios
        let pontos: Ponto[] = [];
    
        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

		assert.strictEqual(elevadorOrError.isSuccess, true);
	});

	
    it('Elevador não é criado com 1 ou mais pontos', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Cria 1 ponto
        let pontos: Ponto[] = [];
        let idPonto = IdPonto.create(1).getValue();
        let tipoPonto = TipoPonto.create(" ").getValue();
        let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
        pontos.push(Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue())

        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

		assert.strictEqual(elevadorOrError.isFailure, true);
	});

    
    it('Elevador não é criado com menos de 2 pisos', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Criar array de pontos vazios
        let pontos: Ponto[] = [];
        
        // Criar 1 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 1 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

		assert.strictEqual(elevadorOrError.isFailure, true);
	});
    /*
    it('Posição do elevador é devolvida é correta', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Criar 4 pontos
        let pontos: Ponto[] = [];
        for (let i = 0; i < 4 ; i++ ){
            let idPonto = IdPonto.create(i+1).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            pontos.push(Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue()) 
        }

        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

        const res = elevadorOrError.getValue().posicao();
        const expected = [0,0,1,1] 

		for (let i = 0; i < res.length; i++ ){
            expect(expected[i]).to.equal(res[i]);
        }
	});

    it('Orientação elevador é norte ', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Criar 4 pontos
    
        let pontos: Ponto[] = [];
        for (let i = 0; i < 4 ; i++ ){
            let idPonto = IdPonto.create(i+1).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            pontos.push(Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue()) 
        }

        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevador = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador).getValue()

		assert.strictEqual(elevador.orientacao(), "norte" );
	});

    it('Orientação elevador é norte ', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        //Criar 4 pontos
    
        let pontos: Ponto[] = [];
        for (let i = 0; i < 4 ; i++ ){
            let idPonto = IdPonto.create(i+1).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
            pontos.push(Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue()) 
        }

        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: pontoArray,
            }, idPiso).getValue())
        }

        let elevador = await Elevador.create({
            pisosServidos: pisosServidos,
            pontos: pontos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador).getValue()

		assert.strictEqual(elevador.orientacao(), "oeste" );
	});
    */
});
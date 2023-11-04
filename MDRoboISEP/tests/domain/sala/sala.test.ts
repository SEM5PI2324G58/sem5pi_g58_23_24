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
import CategorizacaoSala from '../../../src/domain/sala/CategorizacaoSala';
import DescricaoSala from '../../../src/domain/sala/DescricaoSala';
import NomeSala from '../../../src/domain/sala/NomeSala';
import { Sala } from '../../../src/domain/sala/Sala';

async function newDummyPonto(x: number, y: number, id: number) {
    let idPonto = IdPonto.create(id).getValue();
    let tipoPonto = TipoPonto.create(" ").getValue();
    let coordenadas = Coordenadas.create({ abscissa: x, ordenada: y }).getValue();
    return Ponto.create({ coordenadas: coordenadas, tipoPonto: tipoPonto }, idPonto).getValue();
}
describe('sala domain', function () {

    it('sala é criado com sucesso', async function () {
        let pontoArray: Ponto[] = [];
        let ponto = await newDummyPonto(0, 0, 1);
        pontoArray[0] = ponto;
        ponto = await newDummyPonto(1, 1, 2);
        pontoArray[1] = ponto;


        let pontoMatriz: Ponto[][] = [];
        pontoMatriz[0] = pontoArray;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: pontoMatriz
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
            listaPontos: pontoArray,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.isSuccess, true);
    });

    it('sala não é criado com piso null', async function () {
        let pontoArray: Ponto[] = [];
        let ponto = await newDummyPonto(0, 0, 1);
        pontoArray[0] = ponto;
        ponto = await newDummyPonto(1, 1, 2);
        pontoArray[1] = ponto;


        let pontoMatriz: Ponto[][] = [];
        pontoMatriz[0] = pontoArray;

        let pisoA : Piso;

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
            listaPontos: pontoArray,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "piso is null or undefined");
    });

    it('sala não é criado com categoria null', async function () {
        let pontoArray: Ponto[] = [];
        let ponto = await newDummyPonto(0, 0, 1);
        pontoArray[0] = ponto;
        ponto = await newDummyPonto(1, 1, 2);
        pontoArray[1] = ponto;


        let pontoMatriz: Ponto[][] = [];
        pontoMatriz[0] = pontoArray;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: pontoMatriz
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError : CategorizacaoSala;
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
            listaPontos: pontoArray,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "categoria is null or undefined");
    });

    it('sala não é criado com descricao null', async function () {
        let pontoArray: Ponto[] = [];
        let ponto = await newDummyPonto(0, 0, 1);
        pontoArray[0] = ponto;
        ponto = await newDummyPonto(1, 1, 2);
        pontoArray[1] = ponto;


        let pontoMatriz: Ponto[][] = [];
        pontoMatriz[0] = pontoArray;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: pontoMatriz
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError : DescricaoSala;
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
            listaPontos: pontoArray,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "descricao is null or undefined");
    });

    it('sala não é criada com uma lista de pontos de tamanho superior a 2', async function () {
        let pontoArray: Ponto[] = [];
        let ponto = await newDummyPonto(0, 0, 1);
        pontoArray[0] = ponto;
        ponto = await newDummyPonto(1, 1, 2);
        pontoArray[1] = ponto;
        ponto = await newDummyPonto(2, 2, 3);
        pontoArray[2] = ponto;

        let pontoMatriz: Ponto[][] = [];
        pontoMatriz[0] = pontoArray;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: pontoMatriz
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
            listaPontos: pontoArray,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "listaPontos deve ter um tamanho igual a 2.");
    });

});
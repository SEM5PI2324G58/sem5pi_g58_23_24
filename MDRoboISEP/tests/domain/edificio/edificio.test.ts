import { Edificio } from '../../../src/domain/edificio/Edificio';
import {it} from 'mocha';

import {expect} from 'chai';
import { Nome } from '../../../src/domain/edificio/Nome';
import { Codigo } from '../../../src/domain/edificio/Codigo'
import { Dimensao } from '../../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../../src/domain/edificio/DescricaoEdificio';

describe('teste de edificio', () => {
    //Valores válidos para criação de um edificio
    let nome = Nome.create('Edificio A');
    let codigo = Codigo.create('ED01');
    let dimensao = Dimensao.create(10,10);
    let descricao = DescricaoEdificio.create('Edificio A');

    it('Criação de Edifício Válido com atributos não essenciais', () => {
        let edificioProps : any = {
            nome:nome.getValue(),
            dimensao:dimensao.getValue(),
            descricao:descricao.getValue(),
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue());
        expect(true).to.equal(edificio.isSuccess);
    });

    it('Criação de Edifício Válido apenas com atributos essenciais', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue());
        expect(true).to.equal(edificio.isSuccess);
    });
    it('Criação de Edifício com Dimensão Null', () => {
        let edificioProps : any = {
            dimensao:null,
        };
        const edificioInvalido = Edificio.create(edificioProps,codigo.getValue());
        expect(false).to.equal(edificioInvalido.isSuccess);
    });
    it('Criação de Edifício com Dimensão Undefined', () => {
        let edificioProps : any = {
            dimensao:undefined,
        };
        const edificioInvalido = Edificio.create(edificioProps,codigo.getValue());
        expect(false).to.equal(edificioInvalido.isSuccess);
    });
});
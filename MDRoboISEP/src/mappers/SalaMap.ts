import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';
import { Ponto } from "../domain/ponto/Ponto";
import PontoRepo from "../repos/PontoRepo";

import { Sala } from "../domain/sala/Sala";
import { ISalaPersistence } from "../dataschema/ISalaPersistence";
import NomeSala from "../domain/sala/NomeSala";
import DescricaoSala from "../domain/sala/DescricaoSala";
import CategorizacaoSala from "../domain/sala/CategorizacaoSala";
import ISalaDTO from "../dto/ISalaDTO";
import { Piso } from "../domain/piso/Piso";
import PisoRepo from "../repos/PisoRepo";


export class SalaMap extends Mapper<Sala> {

    public static toDTO(sala: Sala): ISalaDTO {
        //Not implemented yet
        //return error
        return null;
    }

    public static async toDomain(raw: any): Promise<Sala> {
        //criar lista de pontos
        let listaPonto: Ponto[] = [];
        if (raw.listaPontos !== null && raw.listaPontos !== undefined && raw.listaPontos.length > 0) {
            const repoPonto = Container.get(PontoRepo);
            for (let i = 0; i < raw.listaPontos.length; i++) {
                if (raw.listaPontos[i] === undefined || raw.listaPontos[i] === null) {
                    listaPonto[i] = raw.listaPontos[i];
                }
                else {
                    listaPonto[i] = await repoPonto.findByDomainId(raw.listaPontos[i]);
                    if (listaPonto[i] === null) {
                        return null;
                    }
                }
            }
        }

        let maxiD = raw.domainID;
        let id = NomeSala.create(maxiD).getValue();
        let categoria: CategorizacaoSala;
        let descricao: DescricaoSala;
        let piso: Piso;

        if (raw.categoria === null || raw.categoria === undefined) {
            return null;
        }
        if (raw.categoria instanceof CategorizacaoSala && raw.descricao instanceof DescricaoSala && raw.piso instanceof Piso) {
            categoria = raw.categoria;
            descricao = raw.descricao;
            piso = raw.piso;
        } else {
            let categoriaSala = String(raw.categoria);
            let descricaoSala = String(raw.descricao);
            let pisoSala = Number(raw.piso);

            piso = await Container.get(PisoRepo).findByDomainId(pisoSala);
            categoria = CategorizacaoSala.create(categoriaSala).getValue();
            descricao = DescricaoSala.create(descricaoSala).getValue();
        }
        const salaOrError = Sala.create({
            categoria: categoria,
            descricao: descricao,
            listaPontos: listaPonto,
            piso: piso,
        }, id);

        return salaOrError.isSuccess ? salaOrError.getValue() : null;
    }

    public static toPersistence(sala: Sala): any {

        //criar lista de number com os ids dos pontos
        let listaPontos: number[] = [];
        //passar os id dos pontos para a lista

        if (sala.props.listaPontos === null || sala.props.listaPontos === undefined || sala.props.listaPontos.length === 0) {
            return null;
        }

        for (let index = 0; index < sala.props.listaPontos.length; index++) {
            const element = sala.props.listaPontos[index];
            if (element === null || element === undefined) {
                listaPontos.push(element);
            }
            else {
                listaPontos.push(element.returnIdPonto());
            }
        }

        let dadosSala = {
            domainID: sala.id.toValue(),
            categoria: sala.props.categoria.props.categorizacao,
            descricao: sala.props.descricao.props.descricao,
            listaPontos: listaPontos,
            piso: sala.props.piso.returnIdPiso()
        } as unknown as ISalaPersistence

        return dadosSala;
    }
}
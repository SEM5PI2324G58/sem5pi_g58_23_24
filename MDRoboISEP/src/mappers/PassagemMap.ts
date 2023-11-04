import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';
import IPassagemDTO from "../dto/IPassagemDTO";
import { Passagem } from "../domain/passagem/Passagem";
import { IPassagemPersistence } from "../dataschema/IPassagemPersistence";
import { Ponto } from "../domain/ponto/Ponto";
import PontoRepo from "../repos/PontoRepo";
import PisoRepo from "../repos/PisoRepo";

import { IdPassagem } from "../domain/passagem/IdPassagem";
import { Piso } from "../domain/piso/Piso";
import IListarPassagemDTO from "../dto/IListarPassagemDTO";
import IListarPisoComPassagensDTO from "../dto/IListarPisoComPassagensDTO";
import { Edificio } from "../domain/edificio/Edificio";

type Pair<K, V> = {
  first: K;
  second: V;
};

export class PassagemMap extends Mapper<Passagem> {


  public static toDTO(passagem: Passagem): IPassagemDTO {
    //Not implemented yet
    //return error
    return null;
  }


  public static toListarPisoComPassagensDTO(map: Map<Passagem, Pair<Piso, Piso>>, pairpair: Pair<Pair<number, number>, string>[],
    pair: Pair<number, Edificio>[]): IListarPisoComPassagensDTO {

    let mapIdPassagemPairIdPisoDTO: Pair<number, Pair<number, number>>[] = [];

    for (let [key, value] of map) {
      const newPair: Pair<number, Pair<number, number>> = {
        first: Number(key.id.toValue()),
        second: {
          first: value.first.returnIdPiso(),
          second: value.second.returnIdPiso()
        }
      };
      mapIdPassagemPairIdPisoDTO.push(newPair);
    }

    let pairIdPisoIdEdificioDTO: Pair<number, string>[] = [];
    for (let par of pair) {
      const newPair: Pair<number, string> = {
        first: par.first,
        second: par.second.returnEdificioId()
      };
      pairIdPisoIdEdificioDTO.push(newPair);
    }

    const dados: IListarPisoComPassagensDTO = {
      mapIdPassagemPairIdPiso: mapIdPassagemPairIdPisoDTO,
      pairNumeroPisoIdPisoPairDescricao: pairpair,
      pairIdPisoIdEdificio: pairIdPisoIdEdificioDTO,
    } as IListarPisoComPassagensDTO;

    return dados;
  }

  public static toListarPassagemDTO(passagem: Passagem): IListarPassagemDTO {
    let dadosPassagem: any = {
      id: passagem.id.toValue(),
      idPisoA: passagem.props.pisoA.returnIdPiso(),
      numeroPisoA: passagem.props.pisoA.returnNumeroPiso(),
      idPisoB: passagem.props.pisoB.returnIdPiso(),
      numeroPisoB: passagem.props.pisoB.returnNumeroPiso(),
    }
    return dadosPassagem as IListarPassagemDTO;
  }

  public static async toDomain(raw: any): Promise<Passagem> {
    //criar lista de pontos
    let listaPonto: Ponto[] = [];
    if (raw instanceof Passagem) {
      return raw;
    }
    if (raw.listaPontos !== null && raw.listaPontos !== undefined && raw.listaPontos.length > 0) {
      const repoPonto = Container.get(PontoRepo);
      for (let i = 0; i < raw.listaPontos.length; i++) {
        if (raw.listaPontos[i] === null || raw.listaPontos[i] === undefined) {
          listaPonto.push(undefined);
        }

        else {
          listaPonto[i] = await repoPonto.findByDomainId(raw.listaPontos[i]);
          if (listaPonto[i] === null) {
            return null;
          }
        }
      }
    }

    let id = IdPassagem.create(raw.domainID).getValue();
    let pisoA: Piso;
    let pisoB: Piso;

    if (raw.pisoA === null || raw.pisoA === undefined || raw.pisoB === null || raw.pisoB === undefined) {
      return null;
    }

    const repoPiso = Container.get(PisoRepo);
    pisoA = await repoPiso.findByDomainId(raw.pisoA);
    pisoB = await repoPiso.findByDomainId(raw.pisoB);

    const passagemOrError = Passagem.create({
      listaPontos: listaPonto,
      pisoA: pisoA,
      pisoB: pisoB,
    }, id);

    return passagemOrError.isSuccess ? passagemOrError.getValue() : null;
  }

  public static toPersistence(passagem: Passagem): any {

    //criar lista de number com os ids dos pontos
    let listaPontos: number[] = [];
    //passar os id dos pontos para a lista
    for (let index = 0; index < passagem.props.listaPontos.length; index++) {
      const element = passagem.props.listaPontos[index];
      if (element === null || element === undefined) {
        listaPontos.push(undefined);
      }
      else {
        listaPontos.push(element.returnIdPonto());
      }
    }

    let dadosPassagem = {
      domainID: Number(passagem.id.toValue()),
      listaPontos: listaPontos,
      pisoA: passagem.props.pisoA.returnIdPiso(),
      pisoB: passagem.props.pisoB.returnIdPiso(),
    } as unknown as IPassagemPersistence

    return dadosPassagem;
  }
}
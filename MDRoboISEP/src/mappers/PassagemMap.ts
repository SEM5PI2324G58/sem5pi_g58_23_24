import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';
import IPassagemDTO from "../dto/IPassagemDTO";
import { Passagem } from "../domain/passagem/Passagem";
import { IPassagemPersistence } from "../dataschema/IPassagemPersistence";
import { Ponto } from "../domain/ponto/Ponto";
import PontoRepo from "../repos/PontoRepo";
import PisoRepo from "../repos/PisoRepo";

import { IdPassagem } from "../domain/passagem/IdPassagem";
import PassagemRepo from "../repos/PassagemRepo";
import { Piso } from "../domain/piso/Piso";
import IListarPassagemDTO from "../dto/IListarPassagemDTO";
import { Edificio } from "../domain/edificio/Edificio";
import EdificioRepo from "../repos/EdificioRepo";


export class PassagemMap extends Mapper<Passagem> {

  public static toDTO(passagem: Passagem): IPassagemDTO {
    //Not implemented yet
    //return error
    return null;
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

    let passagemRepo = Container.get(PassagemRepo)
    let maxiD = await passagemRepo.getMaxId();
    let id = IdPassagem.create(maxiD).getValue();
    let pisoA: Piso;
    let pisoB: Piso;
    let edificioA: Edificio;
    let edificioB: Edificio;

    if (raw.pisoA === null || raw.pisoA === undefined || raw.pisoB === null || raw.pisoB === undefined) {
      return null;
    }

    const repoPiso = Container.get(PisoRepo);
    const repoEdificio = Container.get(EdificioRepo);
    pisoA = await repoPiso.findByDomainId(raw.pisoA);
    pisoB = await repoPiso.findByDomainId(raw.pisoB);
    edificioA = await repoEdificio.findByDomainId(raw.edificioA);
    edificioB = await repoEdificio.findByDomainId(raw.edificioB);

    const passagemOrError = Passagem.create({
      listaPontos: listaPonto,
      pisoA: pisoA,
      pisoB: pisoB,
      edificioA: edificioA,
      edificioB: edificioB,
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
      domainID: passagem.id.toValue(),
      listaPontos: listaPontos,
      pisoA: passagem.props.pisoA.returnIdPiso(),
      pisoB: passagem.props.pisoB.returnIdPiso(),
      edificioA: passagem.props.edificioA.id.toValue(),
      edificioB: passagem.props.edificioB.id.toValue(),
    } as unknown as IPassagemPersistence

    return dadosPassagem;
  }
}
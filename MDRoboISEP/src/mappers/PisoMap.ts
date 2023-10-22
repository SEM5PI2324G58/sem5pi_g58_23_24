import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';

import { Document, Model } from 'mongoose';
import { IPisoPersistence } from '../dataschema/IPisoPersistence';

import IPisoDTO from "../dto/IPisoDTO";
import { Piso } from "../domain/piso/Piso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { NumeroPiso } from "../domain/piso/NumeroPiso";
import { DescricaoPiso } from "../domain/piso/DescricaoPiso";
import { IdPiso } from "../domain/piso/IdPiso";
import { Ponto } from "../domain/ponto/Ponto"
import PontoRepo from "../repos/PontoRepo";


export class PisoMap extends Mapper<Piso> {
  
  public static toDTO(piso: Piso): IPisoDTO {
    return {
      id: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(),
      descricaoPiso: piso.returnDescricaoPiso()
    } as IPisoDTO;
  }

  public static async toDomain (raw: any): Promise<Piso> {
    
    const numeroPisoOrError = NumeroPiso.create(raw.numeroPiso);
    const descricaoPisoOrError = DescricaoPiso.create(raw.descricaoPiso);
    const IdPisoError = IdPiso.create(raw.domainID);

    const repo = Container.get(PontoRepo);
    
    
    let ponto: Ponto [][] = [];
    for (let i = 0; i < raw.pontos.length; i++) {
      ponto[i]=[];
      for (let j = 0; j < raw.pontos[i].length; j++) {
        ponto[i][j] = await repo.findByDomainId(raw.pontos[i][j]);
      }
    }      

    const userOrError = Piso.create({
      numeroPiso: numeroPisoOrError.getValue(),
      descricaoPiso: descricaoPisoOrError.getValue(),
      mapa: ponto,
      }, IdPisoError.getValue())

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
    
  }

  public static toPersistence (piso: Piso): any {
    return {
      domainId: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(),
      descricaoPiso: piso.returnDescricaoPiso(),
      pontos: piso.returnListaDeIdDosPontos(),
    }
  }
}
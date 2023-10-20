import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPisoPersistence } from '../dataschema/IPisoPersistence';

import IPisoDTO from "../dto/IPisoDTO";
import { Piso } from "../domain/piso/Piso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { NumeroPiso } from "../domain/piso/NumeroPiso";
import { DescricaoPiso } from "../domain/piso/DescricaoPiso";


export class PisoMap extends Mapper<Piso> {
  
  public static toDTO(piso: Piso): IPisoDTO {
    return {
      id: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(),
      descricaoPiso: piso.returnDescricaoPiso()
    } as IPisoDTO;
  }

  public static toDomain (raw: any): Piso {
    
    const numeroPisoOrError = NumeroPiso.create(raw.numeroPiso);
    const userPasswordOrError = DescricaoPiso.create(raw.descricaoPiso);

    const userOrError = Piso.create({
      numeroPiso: numeroPisoOrError.getValue(),
      descricaoPiso: userPasswordOrError.getValue(),
    }, new UniqueEntityID(raw.domainId))

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
    
  }

  public static toPersistence (piso: Piso): any {
    return {
      domainId: piso.id.toString(),
      numeroPiso: piso.returnNumeroPiso,
      descricaoPiso: piso.returnDescricaoPiso
    }
  }
}
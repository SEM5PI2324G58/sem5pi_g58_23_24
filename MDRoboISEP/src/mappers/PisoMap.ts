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
    let dadosPiso : any = {
      id: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(), 
    }

    
    if(piso.props.descricaoPiso !== undefined && piso.props.descricaoPiso !== null){
      dadosPiso.descricaoPiso = piso.returnDescricaoPiso();
    }

    return dadosPiso as IPisoDTO;
  }

  public static async toDomain (raw: any): Promise<Piso> {
    let dadosPiso : any = {
      numeroPiso: NumeroPiso.create(raw.numeroPiso).getValue()      
    }
    
    if  (raw.descricaoPiso !== null && raw.descricaoPiso !== undefined){
      const descricaoPisoOrError = DescricaoPiso.create(raw.descricaoPiso);
      dadosPiso.descricaoPiso = descricaoPisoOrError.getValue();
    }
    const IdPisoError = IdPiso.create(Number(raw.domainID));

    
    
    if  (raw.pontos !== null && raw.pontos !== undefined){
    let ponto: Ponto [][] = [];
    const repo = Container.get(PontoRepo);
      for (let i = 0; i < raw.pontos.length; i++) {
        ponto[i]=[];
        for (let j = 0; j < raw.pontos[i].length; j++) {
          ponto[i][j] = await repo.findByDomainId(raw.pontos[i][j]);
        }
      }   
      dadosPiso.mapa = ponto;   
    }
    const userOrError = Piso.create(
      dadosPiso, IdPisoError.getValue())

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
    
  }

  public static toPersistence (piso: Piso): any {
    let dadosPiso : any = {
      domainID: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(),
      pontos: piso.returnListaDeIdDosPontos(),        
    }

    
    if(piso.props.descricaoPiso !== undefined && piso.props.descricaoPiso !== null){
      dadosPiso.descricaoPiso = piso.returnDescricaoPiso();
    }

    return dadosPiso;
  }
}
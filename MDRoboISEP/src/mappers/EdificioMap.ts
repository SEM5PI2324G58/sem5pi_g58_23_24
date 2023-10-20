import { Mapper } from "../core/infra/Mapper";
import IEdificioDTO from "../dto/IEdificioDTO";
import { Edificio } from "../domain/edificio/Edificio";
import {Piso} from '../domain/piso/Piso';

export class EdificioMap extends Mapper<Edificio> {
  
  public static toDTO(edificio: Edificio): IEdificioDTO {
    return {
      codigo: edificio.id.toString(),
      nome: edificio.props.nome.props.nome,
      descricao: edificio.props.descricao.props.descricao,
      dimensaoX: edificio.props.dimensao.props.x,
      dimensaoY: edificio.props.dimensao.props.y
    } as IEdificioDTO;
  }

  public static toDomain (raw: any): Edificio {
    let listaPiso: Piso[];
    for(let i; i<raw.piso.length; i++){
      listaPiso.push(raw.piso[i]);
    }
    const edificioOrError = Edificio.create(raw.nome,raw.dimensaoX,raw.dimensaoY,raw.descricao,raw.codigo,listaPiso);

    edificioOrError.isFailure ? console.log(edificioOrError.error) : '';
    
    return edificioOrError.isSuccess ? edificioOrError.getValue() : null;

  }

  public static toPersistence (edificio: Edificio): any {
    return {
      codigo: edificio.id.toString(),
      nome: edificio.props.nome.props.nome,
      descricao: edificio.props.descricao.props.descricao,
      dimensaoX: edificio.props.dimensao.props.x,
      dimensaoY: edificio.props.dimensao.props.y,
    }
  }
}
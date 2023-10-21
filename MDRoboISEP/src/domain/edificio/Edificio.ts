import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Codigo } from "./Codigo";
import { Piso } from "../piso/Piso";
import { Guard } from "../../core/logic/Guard";
import { Elevador } from "../elevador/Elevador";



interface EdificioProps{
  nome?: Nome;
  dimensao: Dimensao;
  descricao?: DescricaoEdificio;
  listaPisos: Piso[];
  elevador?: Elevador;
}

export class Edificio extends AggregateRoot<EdificioProps> {
  private constructor (props: EdificioProps, id: UniqueEntityID){
      super(props, id);
  }

  public addPiso(piso: Piso){
    this.props.listaPisos.push(piso);
  }

  public static create (props:EdificioProps, codigo :UniqueEntityID): Result<Edificio> {
    
    const guardedProps = { argument: props.dimensao, argumentName: 'dimensão' };
    const result = Guard.againstNullOrUndefined(guardedProps.argument,guardedProps.argumentName);

    if(result.succeeded === false){
      return Result.fail<Edificio>(result.message);
    }else{
      const edificio = new Edificio({...props}, codigo);
      return Result.ok<Edificio>(edificio);
    }
  }
}
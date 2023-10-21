import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Codigo } from "./Codigo";
import { Piso } from "../piso/Piso";
import { Guard } from "../../core/logic/Guard";



interface EdificioProps{
  nome: Nome;
  dimensao: Dimensao;
  descricao: DescricaoEdificio;
  listaPisos: Piso[];
}

export class Edificio extends AggregateRoot<EdificioProps> {
  private constructor (props: EdificioProps, id: UniqueEntityID){
      super(props, id);
  }

  public addPiso(piso: Piso){
    this.props.listaPisos.push(piso);
  }

  public static create (nomeString:string,dimensaoX: number,dimensaoY:number, descricaoString:string,codigoString: string, listaPisos?:Piso[]): Result<Edificio> {
    let guardResults : any[];
    guardResults.push(Nome.create(nomeString));
    guardResults.push(Dimensao.create(dimensaoX,dimensaoY));
    guardResults.push(DescricaoEdificio.create(descricaoString));
    guardResults.push(Codigo.create(codigoString));
    const guardFinal = Guard.combine(guardResults);
    if(guardFinal.succeeded === false){
      return Result.fail<Edificio>(guardFinal.message);
    }
    const edificio = new Edificio({nome: guardResults[0].getValue(), dimensao:guardResults[1].getValue(), descricao:guardResults[2].getValue(), listaPisos : listaPisos || []}, guardResults[3].getValue());
    return Result.ok<Edificio>(edificio);
  }
}
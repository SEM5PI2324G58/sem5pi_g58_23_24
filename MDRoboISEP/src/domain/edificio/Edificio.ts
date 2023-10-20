import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Codigo } from "./Codigo";
import { Piso } from "../piso/Piso";



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

  public static create (nomeString:string,dimensaoX: number,dimensaoY:number, descricaoString:string,codigoString: string, listaPisos?:Piso[]): Result<Edificio> {
    let nome = Nome.create(nomeString).getValue();
    let descricao = DescricaoEdificio.create(descricaoString).getValue();
    let dimensao = Dimensao.create(dimensaoX,dimensaoY).getValue();
    let codigo = Codigo.create(codigoString).getValue();
    const edificio = new Edificio({nome: nome, dimensao:dimensao, descricao:descricao, listaPisos : listaPisos || []}, codigo);
    return Result.ok<Edificio>(edificio);
  }
}
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { Ponto } from "../ponto/Ponto";
import DescricaoSala  from "./DescricaoSala";
import CategorizacaoSala from "./CategorizacaoSala";
import NomeSala from "./NomeSala";
import { Piso } from "../piso/Piso";



interface SalaProps {
    categoria: CategorizacaoSala;
    descricao?: DescricaoSala;
    piso: Piso;
    listaPontos: Ponto[];
}

export class Sala extends AggregateRoot<SalaProps> {
  private constructor(props: SalaProps, id: NomeSala) {
    super(props, id);
  }

  public static create(props: SalaProps, idPassagem: NomeSala): Result<Sala> {
    const guardedProps = [
      { argument: props.categoria, argumentName: 'categoria' },
      { argument: props.descricao, argumentName: 'descricao' },
      { argument: props.listaPontos, argumentName: 'listaPontos' },
      { argument: props.piso, argumentName: 'piso' },
    ];

    const guard = Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName);
    const guard2 = Guard.againstNullOrUndefined(guardedProps[1].argument,guardedProps[1].argumentName);
    const guard3 = Guard.arrayHasSpecificLength(guardedProps[2].argument as any[], 2, guardedProps[2].argumentName);
    const guard4 = Guard.againstNullOrUndefined(guardedProps[3].argument,guardedProps[3].argumentName);

    let guardResult = Guard.combine([guard,guard2,guard3,guard4]);
    
    if (!guardResult.succeeded) {
      return Result.fail<Sala>(guardResult.message);
    }
    else {
      const sala = new Sala({ ...props }, idPassagem);
      return Result.ok<Sala>(sala);
    }
  }

  public returnNomeSala() : string{
    return this._id.toString();
  }

  public returnCategoriaSala() : string{
    return this.props.categoria.toString();
  }

  public returnDescricaoSala() : string{
    return this.props.descricao.toString();
  }

  public atualizarListaPontos(listaPontos: Ponto[]) : void{
    this.props.listaPontos = listaPontos;
  }
}
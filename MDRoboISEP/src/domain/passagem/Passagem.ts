import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { IdPassagem } from "./IdPassagem";
import { Ponto } from "../ponto/Ponto";
import { Guard } from "../../core/logic/Guard";
import { Piso } from "../piso/Piso";

interface PassagemProps {
  listaPontos: Ponto[];
  pisoA: Piso;
  pisoB: Piso;
}

export class Passagem extends AggregateRoot<PassagemProps> {
  private constructor(props: PassagemProps, id: IdPassagem) {
    super(props, id);
  }

  public static create(props: PassagemProps, idPassagem: IdPassagem): Result<Passagem> {
    const guardedProps = [ 
      { argument: props.listaPontos, argumentName: 'listaPontos'},
      { argument: props.pisoA, argumentName: 'pisoA'},
      { argument: props.pisoB, argumentName: 'pisoB' },
    ];

    let guard1 = Guard.arrayHasSpecificLength(guardedProps[0].argument as any[], 4, guardedProps[0].argumentName);
    let guard2 = Guard.againstNullOrUndefined(guardedProps[1].argument, guardedProps[1].argumentName);
    let guard3 = Guard.againstNullOrUndefined(guardedProps[2].argument, guardedProps[2].argumentName);
    
    let guardResult = Guard.combine([guard1,guard2,guard3]);
    //chamar ao ponto uma função que verifica se dois pontos são do mesmo edificio

    if (guardResult.succeeded === false) {
      return Result.fail<Passagem>(guardResult.message);
    } else {
      const passagem = new Passagem({ ...props }, idPassagem);
      return Result.ok<Passagem>(passagem);
    }
  }


}
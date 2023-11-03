import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { IdPassagem } from "./IdPassagem";
import { Ponto } from "../ponto/Ponto";
import { Guard } from "../../core/logic/Guard";
import { Piso } from "../piso/Piso";
import { Edificio } from "../edificio/Edificio";


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
    const guardedProps = { argument: props.listaPontos, argumentName: 'Lista de Pisos' };

    const result = Guard.arrayHasSpecificLength(guardedProps.argument, 4, guardedProps.argumentName);
    //chamar ao ponto uma função que verifica se dois pontos são do mesmo edificio

    if (result.succeeded === false) {
      return Result.fail<Passagem>(result.message);
    } else {
      const passagem = new Passagem({ ...props }, idPassagem);
      return Result.ok<Passagem>(passagem);
    }
  }


}
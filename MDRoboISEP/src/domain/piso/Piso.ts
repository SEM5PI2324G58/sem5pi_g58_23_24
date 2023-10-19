import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { NumeroPiso } from "./NumeroPiso";
import { DescricaoPiso } from "./DescricaoPiso";
import { Guard } from "../../core/logic/Guard";


interface pisoProps {
  numeroPiso: NumeroPiso;
  descricaoPiso: DescricaoPiso;
}

export class Piso extends AggregateRoot<pisoProps> {

  public returnIdPiso() : number{
    return Number(this.id.toValue);
  }

  public returnNumeroPiso() : number{
    return this.props.numeroPiso.props.nPiso;
  }

  public returnDescricaoPiso() : string{
    return this.props.descricaoPiso.props.descricao;
  }

  private constructor (props : pisoProps, id?: UniqueEntityID) {
      super(props,id)
  }

  public static create (props: pisoProps, id?: UniqueEntityID): Result<Piso> {

    const guardedProps = [
      { argument: props.numeroPiso, argumentName: 'numeroPiso' },
      { argument: props.descricaoPiso, argumentName: 'descricaoPiso' },
    ];

    const guardResult = Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName);

    if (!guardResult.succeeded) {
      return Result.fail<Piso>(guardResult.message)
    }     
    else {
      const piso = new Piso({
        ...props
      }, id);

      return Result.ok<Piso>(piso);
    }
  }
}
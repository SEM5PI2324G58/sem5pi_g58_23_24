import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { Coordenadas } from "./Coordenadas";
import { TipoPonto } from "./TipoPonto";
import { IdPonto } from "./IdPonto";
import { Guard } from "../../core/logic/Guard";


interface pontoProps {
  coordenadas: Coordenadas;
  tipoPonto: TipoPonto;
}

export class Ponto extends AggregateRoot<pontoProps> {

  public returnIdPonto() : number{
    return Number(this._id.toValue());
  }
  
  public returnAbscissa() : number{
    return this.props.coordenadas.props.abscissa;
  }

  public returnOrdenada() : number{
    return this.props.coordenadas.props.ordenada;
  }

  public returnTipoPonto() : string{
    return this.props.tipoPonto.props.tipoPonto;
  }

 

  private constructor (props : pontoProps, id?: IdPonto) {
      super(props,id)
  }

  public static create (props: pontoProps, id?: IdPonto): Result<Ponto> {

    const guardedProps = [
      { argument: props.coordenadas, argumentName: 'coordenadas' },
      { argument: props.tipoPonto, argumentName: 'tipoPonto' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Ponto>(guardResult.message)
    }     
    else {
      const piso = new Ponto({
        ...props
      }, id);

      return Result.ok<Ponto>(piso);
    }
  }

  public toElevador() {
    this.props.tipoPonto = TipoPonto.create("Elevador").getValue();
  }
}
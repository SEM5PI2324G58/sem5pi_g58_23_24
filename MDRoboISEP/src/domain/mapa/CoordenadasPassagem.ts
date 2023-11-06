import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";



interface coordenadasPassagemProps {
  id : number;
  abcissa : number;
  ordenada : number;
  orientacao : string;
}

export class CoordenadasPassagem extends ValueObject<coordenadasPassagemProps> {
  private constructor (props : coordenadasPassagemProps) {
    super(props)
  }

  public static create (props: coordenadasPassagemProps): Result<CoordenadasPassagem> {

  const guardedProps = [
    { argument: props.id, argumentName: 'id' },
    { argument: props.abcissa, argumentName: 'abcissa' },
    { argument: props.ordenada, argumentName: 'ordenada' },
    { argument: props.orientacao, argumentName: 'orientacao' },
  ];
    
    const guard1 = Guard.againstNullOrUndefinedBulk(guardedProps);
    const guardResult = Guard.combine([guard1]);
    if (!guardResult.succeeded) {
      return Result.fail<CoordenadasPassagem>(guardResult.message);
    } else {
      return Result.ok<CoordenadasPassagem>(new CoordenadasPassagem({ ...props}))
    }
  }

  public returnId(): number {
    return this.props.id;
  }
  public returnAbcissa(): number {
    return this.props.abcissa;
  }
  public returnOrdenada(): number {
    return this.props.ordenada;
  }
  public returnOrientacao(): string {
    return this.props.orientacao;
  }

}
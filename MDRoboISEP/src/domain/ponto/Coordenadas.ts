import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface coordenadaProps {
    abscissa: number;
    ordenada: number;
}

export class Coordenadas extends ValueObject<coordenadaProps> {
    private constructor (props : coordenadaProps) {
        super(props)
    }

    public static create (props: coordenadaProps): Result<Coordenadas> {
        
        const guardedProps = [
            { argument: props.abscissa, argumentName: 'abscissa' },
            { argument: props.ordenada, argumentName: 'ordenada' },
          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

      
          if (!guardResult.succeeded) {
            return Result.fail<Coordenadas>(guardResult.message)
          }     
          else {
            const coordenadas = new Coordenadas({
              ...props
            });
      
            return Result.ok<Coordenadas>(coordenadas);
        }
    }
}
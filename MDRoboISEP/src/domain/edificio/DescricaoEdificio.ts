import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface DescricaoEdificioProps{
    descricao: string;
}
export class DescricaoEdificio extends ValueObject<DescricaoEdificioProps> {
    private constructor(props:DescricaoEdificioProps){
        super(props);
    }
    public static create (descricaoString: string): Result<DescricaoEdificio> {
      let guardResults : any[];
      guardResults.push(Guard.stringLengthLessOrEqualThan(descricaoString,255,'Descrição do Edifício'));
      guardResults.push(Guard.isAlphanumeric(descricaoString,'Descrição do Edifício'));

      let guardFinal = Guard.combine(guardResults);
      if (guardFinal.succeeded === false) {
        return Result.fail<DescricaoEdificio>('Erro: A descrição tem de ser válida e até 255 caratéres.')
      } else if(Guard.againstNullOrUndefined(descricaoString,'Descrição do Edifício').succeeded === false) {
        return Result.ok<DescricaoEdificio>( null );
      }else{
        const descricao = new DescricaoEdificio({ descricao: descricaoString});
        return Result.ok<DescricaoEdificio>( descricao )
      }
    }
}
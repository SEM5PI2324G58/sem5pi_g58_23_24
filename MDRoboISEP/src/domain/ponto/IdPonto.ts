import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";



export class IdPonto extends UniqueEntityID {
    private constructor (num : string) {
      super(num)
    }

    public static create (id: string): Result<IdPonto> {
      const guardResult = Guard.isPatternValidIdPonto(id,'Id Ponto');
      
      if (!guardResult.succeeded) {
        return Result.fail<IdPonto>(guardResult.message);
      } else {
        return Result.ok<IdPonto>(new IdPonto(id))
      }
    }
}
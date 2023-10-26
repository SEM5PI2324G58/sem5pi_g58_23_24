import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";



export class IdPonto extends UniqueEntityID {
    private constructor (num : number) {
      super(num)
    }

    public static create (id: number): Result<IdPonto> {
      const guardResult = Guard.numberGreaterThanZero(id,'Id Ponto');
      
      if (!guardResult.succeeded) {
        return Result.fail<IdPonto>(guardResult.message);
      } else {
        return Result.ok<IdPonto>(new IdPonto(id))
      }
    }
}
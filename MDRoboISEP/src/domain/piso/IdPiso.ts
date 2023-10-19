import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";



export class IdPiso extends UniqueEntityID {
    private constructor (num : number) {
      super(num)
    }

    public static create (id: number): Result<IdPiso> {
      const guardResult = Guard.numberGreaterThanZero(id,'Id Piso');
      if (!guardResult.succeeded) {
        return Result.fail<IdPiso>(guardResult.message);
      } else {
        return Result.ok<IdPiso>(new IdPiso(id))
      }
    }
}
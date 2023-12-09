
import { Entity } from "../core/domain/Entity";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Guard } from "../core/logic/Guard";
import { Result } from "../core/logic/Result";

export class UserId extends UniqueEntityID {
  private constructor(num: number) {
    super(num)
  }

  public static create(id: number): Result<UserId> {
    const guard1 = Guard.againstNullOrUndefined(id, 'User ID');
    const guard2 = Guard.numberGreaterThanZero(id, 'User ID');
    const guardResult = Guard.combine([guard1, guard2]);
    if (!guardResult.succeeded) {
      return Result.fail<UserId>(guardResult.message);
    } else {
      return Result.ok<UserId>(new UserId(id))
    }
  }
}

import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  getValue(): string {
    return this.props.value;
  }
  
  private constructor (props: UserEmailProps) {
    super(props);
  }

  public static create (email: string): Result<UserEmail> {
    const guardResult = Guard.againstNullOrUndefined(email, 'email');
    if (!guardResult.succeeded) {
      return Result.fail<UserEmail>(guardResult.message);

    }
    const guardResult2 = Guard.againtInvalidEmail(email, 'email');
    if (!guardResult2.succeeded) {
      return Result.fail<UserEmail>(guardResult2.message);
    }
    return Result.ok<UserEmail>(new UserEmail({ value: email }));
  }
}
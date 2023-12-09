import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { UserId } from "./userId";
import { UserEmail } from "./userEmail";
import { Role } from "../domain/role";
import { UserPassword } from "./userPassword";
import { Guard } from "../core/logic/Guard";
import { UserTelefone } from "./userTelefone";
import { UserName } from "./userName";
import { UserNumeroContribuinte } from "./userNumeroContribuinte";
import { UserEstado } from "./userEstado";


interface UserProps {
  name: UserName;
  email: UserEmail;
  telefone: UserTelefone;
  nif?: UserNumeroContribuinte;
  password: UserPassword;
  estado: UserEstado;
  role: Role;
}

export class User extends AggregateRoot<UserProps> {
  getId(): UniqueEntityID {
    return this._id;
  }

  getUserId(): UserId {
    return UserId.caller(this.id)
  }

  getEmail(): UserEmail {
    return this.props.email;
  }

  getName(): UserName {
    return this.props.name;
  }
  
  getTelefone(): UserTelefone {
    return this.props.telefone;
  }

  getNif(): UserNumeroContribuinte {
    if (this.props.nif != undefined && this.props.nif != null) {
      return this.props.nif;
    }
    else {
      return null;
    }
  }

  getPassword(): UserPassword {
    return this.props.password;
  }

  getRole(): Role {
    return this.props.role;
  }

  getEstado(): UserEstado {
    return this.props.estado;
  }
  
  setRole(value: Role) {
      this.props.role = value;
  }

  private constructor (props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: UserProps, id?: UniqueEntityID): Result<User> {

    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.telefone, argumentName: 'telefone' },
      { argument: props.nif, argumentName: 'nif' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.estado, argumentName: 'estado' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message)
    }     
    else {
      const user = new User({
        ...props
      }, id);

      return Result.ok<User>(user);
    }
  }
}
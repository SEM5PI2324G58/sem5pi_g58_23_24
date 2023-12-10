import { Mapper } from "../core/infra/Mapper";
import { IUserDTO } from "../dto/IUserDTO";
import { User } from "../domain/user";
import { Result } from "../core/logic/Result";
import { Role } from "../domain/role";
import { UserEmail } from "../domain/userEmail";
import { UserEstado } from "../domain/userEstado";
import { UserId } from "../domain/userId";
import { UserName } from "../domain/userName";
import { UserNumeroContribuinte } from "../domain/userNumeroContribuinte";
import { UserPassword } from "../domain/userPassword";
import { UserTelefone } from "../domain/userTelefone";


export class UserMap extends Mapper<User> {

  public static toDTO(user: User): IUserDTO {

    const email = user.getEmail();
    const password = user.getPassword();
    const role = user.getRole();
    const estado = user.getEstado();
    const telefone = user.getTelefone();
    const nif = user.getNif();
    const name = user.getName();

    return {
      name: name.getValue(),
      email: email.getValue(),
      telefone: telefone.getValue(),
      nif: nif.getValue(),
      password: password.getValue(),
      estado: estado.getValue(),
      role: role.getValue(),
    } as IUserDTO;
  }

  public static toDTONomeRole(user: User): IUserDTO {

    const role = user.getRole();
    const name = user.getName();

    return {
      name: name.getValue(),
      role: role.getValue(),
    } as IUserDTO;
  }

  public static async toDomain(raw: any): Promise<User> {

    const nameOrError = UserName.create(raw.name);
    const emailOrError = UserEmail.create(raw.email);
    const telefoneOrError = UserTelefone.create(raw.telefone);
    const nifOrError = UserNumeroContribuinte.create(raw.nif);
    const passwordOrError = UserPassword.create({value: raw.password, hashed:true});
    const estadoOrError = UserEstado.create(raw.estado);
    const roleOrError = Role.create(raw.role);
    const userIdOrError = UserId.create(raw.domainId);

    const userOrError = User.create({
      name: nameOrError.getValue(),
      email: emailOrError.getValue(),
      telefone: telefoneOrError.getValue(),
      nif: nifOrError.getValue(),
      password: passwordOrError.getValue(),
      estado: estadoOrError.getValue(),
      role: roleOrError.getValue(),
    }, userIdOrError.getValue());

    if (userOrError.isFailure) {
      return null;
    }

    return userOrError.getValue();
  }

  public static toPersistence(user: User): any {
    return {
      domainId: Number(user.id),
      name: user.getName().getValue(),
      email: user.getEmail().getValue(),
      password: user.getPassword().getValue(),
      role: user.getRole().getValue(),
      estado: user.getEstado().getValue(),
      telefone: user.getTelefone().getValue(),
      nif: user.getNif().getValue(),
    };
  }
}
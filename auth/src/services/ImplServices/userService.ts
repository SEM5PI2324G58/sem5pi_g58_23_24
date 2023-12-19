import { Container, Service, Inject } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

import IUserService from '../IServices/IUserService';
import { UserMap } from "../../mappers/UserMap";
import { IUserDTO } from '../../dto/IUserDTO';

import IUserRepo from '../IRepos/IUserRepo';

import { User } from '../../domain/user/user';
import { UserPassword } from '../../domain/user/userPassword';
import { UserEmail } from '../../domain/user/userEmail';

import { Role } from '../../domain/user/role';

import { Result } from "../../core/logic/Result";
import { UserEstado } from '../../domain/user/userEstado';
import { UserNumeroContribuinte } from '../../domain/user/userNumeroContribuinte';
import { UserName } from '../../domain/user/userName';
import { UserTelefone } from '../../domain/user/userTelefone';
import { ISignupUtenteDTO } from '../../dto/ISignupUtenteDTO';

@Service()
export default class UserService implements IUserService {
  constructor(
    @Inject(config.repos.user.name) private userRepo: IUserRepo,
  ) { }

  public async SignUp(userDTO: IUserDTO): Promise<Result<String>> {
    try {
      const userDocument = await this.userRepo.findByEmail(userDTO.email);
      const found = !!userDocument;

      if (found) {
        return Result.fail<String>("Utilizador já existe com email " + userDTO.email);
      }

      const passwordResult = await UserPassword.create({value: userDTO.password});

      const emailResult = UserEmail.create(userDTO.email);
      const roleResult = Role.create(userDTO.role);
      const estadoResult = UserEstado.create(userDTO.estado);
      let nifResult: Result<UserNumeroContribuinte>;

      if (userDTO.nif) {
        nifResult = UserNumeroContribuinte.create(userDTO.nif);
      }

      const nameResult = UserName.create(userDTO.name);
      const telefoneResult = UserTelefone.create(userDTO.telefone);

      if (!userDTO.nif && userDTO.role === "utente") {
        return Result.fail<String>("NIF é obrigatório para utentes");
      }

      let result: Result<any>;

      if (userDTO.nif) {
        result = Result.combine([passwordResult, emailResult, roleResult, estadoResult, nifResult, nameResult, telefoneResult]);

      }
      else {
        result = Result.combine([passwordResult, emailResult, roleResult, estadoResult, nameResult, telefoneResult]);
      }
      if (result.isFailure) {
        return Result.fail<String>(result.errorValue().toString());
      }

      let email = emailResult.getValue();

      let userOrError: Result<User>;
      if (userDTO.nif) {
        userOrError = User.create(
          {
            password: passwordResult.getValue(),
            role: roleResult.getValue(),
            estado: estadoResult.getValue(),
            nif: nifResult.getValue(),
            name: nameResult.getValue(),
            telefone: telefoneResult.getValue()
          },
          email
        );
      }
      else {
        userOrError = User.create(
          {
            password: passwordResult.getValue(),
            role: roleResult.getValue(),
            estado: estadoResult.getValue(),
            nif : null,
            name: nameResult.getValue(),
            telefone: telefoneResult.getValue()
          },
          email
        );
      }

      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();
      await this.userRepo.save(userResult);
      return Result.ok<String>("Conta criada com sucesso!")

    } catch (e) {
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<Result<{ token: string }>> {

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error('User not registered');
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    const isValidPassword = await argon2.verify(user.getPassword().getValue(), password);
    if (isValidPassword) {
      const token = this.generateToken(user) as string;

      const userDTOResult = UserMap.toDTONomeRole(user) as IUserDTO;

      return Result.ok<{ user: IUserDTO, token: string }>({ user: userDTOResult, token: token });
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setHours(today.getHours() + 1);

    /*
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    const id = user.id.toString();
    const email = user.getEmail();
    const name = user.getName().getValue();
    const role = user.getRole().getValue();

    return jwt.sign(
      {
        id: id,
        email: email, // We are gonna use this in the middleware 'isAuth'
        role: role,
        name: name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

  public async signupUtente(signupUtente: ISignupUtenteDTO): Promise<Result<String>> {
    try {
      const userDocument = await this.userRepo.findByEmail(signupUtente.email);
      const found = !!userDocument;

      if (found) {
        return Result.fail<String>("Já existe um utilizador com esse email");
      }

      const password = await UserPassword.create({ value: signupUtente.password });
      const email = UserEmail.create(signupUtente.email);
      const role = Role.create("utente").getValue();
      const estado = UserEstado.create("pendente").getValue();
      const nif = UserNumeroContribuinte.create(signupUtente.nif);

      const name = UserName.create(signupUtente.name);
      const telefone = UserTelefone.create(signupUtente.telefone);

      let result = Result.combine([password, email, nif, name, telefone]);
      if (result.isFailure) {
        return Result.fail<String>(result.errorValue().toString());
      }

      const userOrError = User.create(
        {
          password: password.getValue(),
          role: role,
          estado: estado,
          nif: nif.getValue(),
          name: name.getValue(),
          telefone: telefone.getValue()
        },
        email.getValue()
      );


      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();

      await this.userRepo.save(userResult);
      return Result.ok<String>("Conta criada com sucesso!")

    } catch (e) {
      throw e;
    }
  }
}

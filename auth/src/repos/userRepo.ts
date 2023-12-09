import { Service, Inject } from 'typedi';

import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserRepo from "../services/IRepos/IUserRepo";
import { User } from "../domain/user";
import { UserId } from "../domain/userId";
import { UserEmail } from "../domain/userEmail";
import { UserMap } from "../mappers/UserMap";

@Service()
export default class UserRepo implements IUserRepo {
  private models: any;

  constructor(
    @Inject('userSchema') private userSchema: Model<IUserPersistence & Document>,
    @Inject('logger') private logger
  ) { }
  public async maxId(): Promise<number> {
    try {
      var maxIdResult = await this.userSchema
        .find({}, { domainID: 1 })
        ;

      if (maxIdResult && maxIdResult.length > 0) {
        return (maxIdResult.sort((a, b) => b._id - a._id))[0]._id;
      }
      else {
        return 0;
      }
    } catch (err) {
      throw err;
    }
  }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(userId: User | string): Promise<boolean> {

    const idX = userId instanceof User ? userId.id.toValue() : userId;

    const query = { domainId: idX };
    const userDocument = await this.userSchema.findOne(query);

    return !!userDocument === true;
  }

  public async save(user: User): Promise<User> {
    const query = { domainId: user.id.toString() };

    const userDocument = await this.userSchema.findOne(query);

    try {
      if (userDocument === null) {
        const rawUser: any = UserMap.toPersistence(user);

        const userCreated = await this.userSchema.create(rawUser);

        return UserMap.toDomain(userCreated);
      } else {
        userDocument.name = user.getName().getValue();
        userDocument.telefone = user.getTelefone().getValue();
        userDocument.email = user.getEmail().getValue();
        userDocument.password = user.getPassword().getValue();
        userDocument.role = user.getRole().getValue();
        userDocument.estado = user.getEstado().getValue();
        await userDocument.save();

        return user;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByEmail(email: UserEmail | string): Promise<User> {
    const query = { email: email.toString() };
    const userRecord = await this.userSchema.findOne(query);

    if (userRecord != null) {
      return UserMap.toDomain(userRecord);
    }
    else
      return null;
  }

  public async findById(userId: UserId | string): Promise<User> {

    const idX = userId instanceof UserId ? (<UserId>userId).toValue() : userId;

    const query = { domainId: idX };
    const userRecord = await this.userSchema.findOne(query);

    if (userRecord != null) {
      return UserMap.toDomain(userRecord);
    }
    else
      return null;
  }
}
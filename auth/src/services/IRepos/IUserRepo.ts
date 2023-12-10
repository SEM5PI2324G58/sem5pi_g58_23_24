import { Repo } from "../../core/infra/Repo";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/userEmail";

export default interface IUserRepo extends Repo<User> {
  	maxId(): Promise<number>;
	save(user: User): Promise<User>;
	findByEmail (email: UserEmail | string): Promise<User>;
	findById (id: number): Promise<User>;
}
  
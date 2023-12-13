import { Result } from "../../core/logic/Result";
import { ISignupUtenteDTO } from "../../dto/ISignupUtenteDTO";
import { IUserDTO } from "../../dto/IUserDTO";

export default interface IUserService  {
  SignUp(userDTO: IUserDTO): Promise<Result<String>>;
  SignIn(email: string, password: string): Promise<Result<{ token: string }>>;
  signupUtente(signupUtente: ISignupUtenteDTO): Promise<Result<String>>;

}

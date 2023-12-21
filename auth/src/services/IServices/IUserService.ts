import { Result } from "../../core/logic/Result";
import { IApproveOrRejectSignUpDTO } from "../../dto/IApproveOrRejectUtenteDTO";
import { ISignupUtenteDTO } from "../../dto/ISignupUtenteDTO";
import { IUserDTO } from "../../dto/IUserDTO";

export default interface IUserService  {
  SignUp(userDTO: IUserDTO): Promise<Result<String>>;
  approveOrRejectSignUp(user: IApproveOrRejectSignUpDTO): Promise<Result<String>>;
  listarUtilizadoresPendentes(): Promise<Result<IUserDTO[]>>;
  SignIn(email: string, password: string): Promise<Result<{ token: string }>>;
  signupUtente(signupUtente: ISignupUtenteDTO): Promise<Result<String>>;
  delete(email: string): Promise<Result<IUserDTO>>;
}

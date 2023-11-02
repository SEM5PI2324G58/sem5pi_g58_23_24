import { Repo } from "../../core/infra/Repo";
import { Passagem } from "../../domain/passagem/Passagem";

export default interface IPassagemRepo extends Repo<Passagem> {
  getMaxId(): Promise<number>;
  findByDomainId(id: number): Promise<Passagem>;
  save(passagem: Passagem): Promise<Passagem>;
  delete(passagem: Passagem): Promise<boolean>;
}
import { Repo } from "../../core/infra/Repo";
import { Sala } from "../../domain/sala/Sala";

export default interface IPassagemRepo extends Repo<Sala> {
  getMaxId(): Promise<number>;
  findByDomainId(id: number): Promise<Sala>;
  save(passagem: Sala): Promise<Sala>;
  delete(sala: Sala): Promise<boolean>;

}
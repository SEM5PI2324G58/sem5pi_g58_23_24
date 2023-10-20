import { Repo } from "../../core/infra/Repo";
import { Edificio } from "../../domain/edificio/Edificio";
import { Codigo } from "../../domain/edificio/Codigo";

export default interface IEdificioRepo extends Repo<Edificio> {
  save(edificio: Edificio): Promise<Edificio>;
  findByDomainId (codigo: Codigo | string): Promise<Edificio>;
}
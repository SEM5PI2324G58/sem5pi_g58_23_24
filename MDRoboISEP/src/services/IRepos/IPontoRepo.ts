import { Repo } from "../../core/infra/Repo";
import { Ponto } from "../../domain/ponto/Ponto";
import { IdPonto } from "../../domain/ponto/IdPonto";

export default interface IPontoRepo extends Repo<Ponto> {
  save(ponto: Ponto): Promise<Ponto>;
  findByDomainId (idPonto: IdPonto | string): Promise<Ponto>;
    
}
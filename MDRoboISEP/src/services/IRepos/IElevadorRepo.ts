import { Repo } from "../../core/infra/Repo";
import { Elevador } from "../../domain/elevador/Elevador";
import { IdElevador } from "../../domain/elevador/IdElevador";

export default interface IElevadorRepo extends Repo<Elevador>{
    save(elevador: Elevador): Promise<Elevador>;
    findByDomain(idElevador: IdElevador | number): Promise<Elevador>;
}
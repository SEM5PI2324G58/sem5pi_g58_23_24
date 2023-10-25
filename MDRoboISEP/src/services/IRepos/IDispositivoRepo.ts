import { Repo } from "../../core/infra/Repo";
import { Dispositivo } from "../../domain/dispositivo/Dispositivo";
import { CodigoDispositivo } from "../../domain/dispositivo/CodigoDispositivo";
import { Nickname } from "../../domain/dispositivo/Nickname";

export default interface IDispositivoRepo extends Repo<Dispositivo> {
  save(dispositivo: Dispositivo): Promise<Dispositivo>;
  findByDomainId (codigo: CodigoDispositivo | string): Promise<Dispositivo>;
  findByNickname (nickname: Nickname | string): Promise<Dispositivo>;
  exists(dispositivo : Dispositivo): Promise<boolean>;
}
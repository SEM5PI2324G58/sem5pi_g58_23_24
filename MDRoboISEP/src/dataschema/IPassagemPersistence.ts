import { Piso } from "../domain/piso/Piso";
import { Ponto } from "../domain/ponto/Ponto";

export interface IPassagemPersistence {
  domainID: number;
  listaPontos: number[];
  pisoA: number;
  pisoB: number;
  edificioA: string;
  edificioB: string;
  }
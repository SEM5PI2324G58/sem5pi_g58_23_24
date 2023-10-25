import { Ponto } from "../domain/ponto/Ponto";

export default interface IPassagemDTO {
    listaPontos: Ponto[];
    id: string;
    idEdificioA: string;
    idEdificioB: string;
    idPisoA: string;
    idPisoB: string;
}
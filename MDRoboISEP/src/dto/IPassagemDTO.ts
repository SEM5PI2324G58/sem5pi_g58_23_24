import { Ponto } from "../domain/ponto/Ponto";

export default interface IPassagemDTO {
    abcissaA: number;
    ordenadaA: number;
    abcissaB: number;
    ordenadaB: number;
    id: string;
    idEdificioA: string;
    idEdificioB: string;
    idPisoA: string;
    idPisoB: string;
}
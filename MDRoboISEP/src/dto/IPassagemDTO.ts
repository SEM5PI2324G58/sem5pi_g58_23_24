import { Ponto } from "../domain/ponto/Ponto";

export default interface IPassagemDTO {
    abcissaA: number;
    ordenadaA: number;
    abcissaB: number;
    ordenadaB: number;
    orientacao: string;
    codigoEdificioA: string;
    codigoEdificioB: string;
    numeroPisoA: number;
    numeroPisoB: number;
}
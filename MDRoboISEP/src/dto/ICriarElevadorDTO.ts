export default interface ICriarElevadorDTO {
    edificio: string,
    pisosServidos: number[];
    xCoord : number;
    yCoord : number;
    orientacao: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    descricao: string;
}
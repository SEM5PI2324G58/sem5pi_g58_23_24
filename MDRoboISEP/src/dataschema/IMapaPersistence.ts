export interface IMapaPersistence {
    idMapa: number;
	mapa: string[][];
    idPassagem : number[];
    abcissa : number[];
    ordenada : number[];
    orientacaoPassagem : string[];
    xCoord: number[];
    yCoord: number[];
    orientacaoElevador: string;
    nome: string[];
    abcissaA : number[];
    ordenadaA : number[];
    abcissaB : number[];
    ordenadaB : number[];
    abcissaPorta : number[];
    ordenadaPorta : number[];
    orientacaoPorta : string[];
  }
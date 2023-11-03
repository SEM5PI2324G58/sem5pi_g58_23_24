export default interface ICarregarPisoDTO{
    codigoEdificio: string,
    numeroPiso: number,
    passagem : {
        id : number,
        abcissa : number,
        ordenada : number,
        orientacao : string,
        codigoEdificioA : string,
        codigoEdificioB : string,
    }
    elevador : {
        xCoord : number,
        yCoord : number,
        orientacao: string,
        marca: string,
        modelo: string,
        numeroSerie : string,
        descricao : string    
    },
    salas: [{
        id: number,
        abcissaA : number,
        ordenadaA : number,
        abcissaB : number,
        ordenadaB : number,
        ordenadaPorta : number,
        abcissaPorta : number,
        orientacaoPorta : string,
        descricao : string,
        categoria : string
    }]
}
export default interface IExportarMapaDTO{
    texturaChao: string,
    texturaParede: string,
    codigoEdificio: string,
    numeroPiso : number,
    matriz ?: string[][],
    elevador ?: any,
    passagens ?: any[],
    portas ?: any[],
}
export default interface ExportarMapa{
    texturaChao?: string,
    texturaParede?: string,
    texturaPorta?: string,
    texturaElevador?: string,
    codigoEdificio: string,
    numeroPiso : number,
    matriz ?: string[][],
    elevador ?: any,
    passagens ?: any[],
    portas ?: any[],
}
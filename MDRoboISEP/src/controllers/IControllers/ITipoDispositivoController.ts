import { NextFunction, Request, Response } from "express";

export default interface TipoDispositivoController {
    criarTipoDispositivo(req: Request, res: Response, next: NextFunction);
}
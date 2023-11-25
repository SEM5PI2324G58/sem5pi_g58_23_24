import { Request, Response, NextFunction } from 'express';

export default interface IPlaneamentoController  {
    encontrarCaminhosEntreEdificios(req: Request, res: Response, next: NextFunction);
}
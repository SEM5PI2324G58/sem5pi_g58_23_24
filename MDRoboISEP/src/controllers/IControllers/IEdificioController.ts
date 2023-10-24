import { Request, Response, NextFunction } from 'express';

export default interface IEdificioController  {
    criarEdificio(req: Request, res: Response, next: NextFunction);
    listarEdificioMinEMaxPisos(req: Request, res: Response, next: NextFunction)
}
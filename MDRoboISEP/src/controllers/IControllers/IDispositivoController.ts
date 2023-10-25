import { Request, Response, NextFunction } from 'express';

export default interface IDispositivoController  {
    adicionarDispositivoAFrota(req: Request, res: Response, next: NextFunction);
}
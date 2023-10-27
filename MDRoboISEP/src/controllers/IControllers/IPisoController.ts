import { Request, Response, NextFunction } from 'express';

export default interface IPisoController  {
  criarPiso(req: Request, res: Response, next: NextFunction);
  listarTodosOsPisosDeUmEdificio(req: Request, res: Response, next: NextFunction);
}
import {Request, Response, NextFunction} from "express";

export default interface IMapaController {
    carregarMapa(req: Request, res: Response, next: NextFunction);
}
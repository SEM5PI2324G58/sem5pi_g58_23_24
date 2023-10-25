import { NextFunction, Request, Response } from "express";

export default interface IPassagemController{
    criarPassagem(req: Request, res: Response, next:NextFunction)
}
import { Inject } from "typedi";
import IElevadorController from "./IControllers/IElevadorController";
import config from "../../config";
import IElevadorService from "../services/IServices/IElevadorService";
import { NextFunction, Request, Response } from "express";
import ICriarElevadorDTO from "../dto/ICriarElevadorDTO";

export default class ElevadorController implements IElevadorController{
    constructor(
        @Inject(config.service.elevador.name) private elevadorServiceInstance : IElevadorService
    ){}

    public async criarElevador(req: Request, res: Response, next: NextFunction) {
        try {
            const elevadorOrError = await this.elevadorServiceInstance.criarElevador(req.body as ICriarElevadorDTO);
              
            if (elevadorOrError.isFailure) {
              return res.status(402).send();
            }
      
            const criarElevadorDTO = elevadorOrError.getValue();
            return res.json( criarElevadorDTO ).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
}
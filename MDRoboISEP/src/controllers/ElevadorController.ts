import { Inject, Service } from "typedi";
import IElevadorController from "./IControllers/IElevadorController";
import config from "../../config";
import IElevadorService from "../services/IServices/IElevadorService";
import { NextFunction, Request, Response } from "express";
import ICriarElevadorDTO from "../dto/ICriarElevadorDTO";


@Service()
export default class ElevadorController implements IElevadorController{
    constructor(
        @Inject(config.services.elevador.name) private elevadorServiceInstance : IElevadorService
    ){}

    public async criarElevador(req: Request, res: Response, next: NextFunction) {
        try {
            const elevadorOrError = await this.elevadorServiceInstance.criarElevador(req.body as ICriarElevadorDTO);
              
            if (elevadorOrError.isFailure) {
                let erro = String(elevadorOrError.errorValue());
                if (erro === "Edificio não existe." || erro === "Foram inseridos pisos inválidos") {
                    res.status(404);
                    return res.json(elevadorOrError.errorValue());
                }
                res.status(400);
                return res.json(elevadorOrError.errorValue());
            }
      
            const criarElevadorDTO = elevadorOrError.getValue();

            res.status(201);
            return res.json(criarElevadorDTO);
        }
        catch (e) {
            return next(e);
        }
    }

    public async editarElevador(req: Request, res: Response, next: NextFunction) {
        try {
            const elevadorOrError = await this.elevadorServiceInstance.editarElevador(req.body as ICriarElevadorDTO);
              
            if (elevadorOrError.isFailure) {
              let erro = String(elevadorOrError.errorValue());
                if (erro === "Edificio não existe." || erro === "Foram inseridos pisos inválidos") {
                    res.status(404);
                    return res.json(elevadorOrError.errorValue());
                }
                res.status(400);
                return res.json(elevadorOrError.errorValue());
            }
      
            const editarElevadorDTO = elevadorOrError.getValue();
            res.status(200)
            return res.json(editarElevadorDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async listarElevadoresDoEdificio(req: Request, res: Response, next: NextFunction) {
        try {
            const listaElevadoresOrErro = await this.elevadorServiceInstance.listarElevadoresDoEdificio(req.body.edificio);
              
            if (listaElevadoresOrErro.isFailure) {
                let erro = String(listaElevadoresOrErro.errorValue());
                if (erro === "Edifício não existe." || erro === "O edifício não tem elevadores.") {
                    res.status(404);
                    return res.json(listaElevadoresOrErro.errorValue());
                }
                res.status(400);
                return res.json(listaElevadoresOrErro.errorValue());
            }
      
            const listaElevadoresDTO = listaElevadoresOrErro.getValue();
            res.status(200);

            return res.json(listaElevadoresDTO);
        }
        catch (e) {
            return next(e);
        }
    }
}
import { Inject, Service } from "typedi";
import IPontoService from "../services/IServices/IPontoService";
import config from "../../config";
import { Request, Response, NextFunction } from "express";
import IPontoController from "./IControllers/IPontoController";
import ICarregarMapaDTO from "../dto/ICarregarMapaDTO";
import { Result } from "../core/logic/Result";

@Service()
export default class PontoController implements IPontoController {
    constructor(
        @Inject(config.services.ponto.name) private pontoServiceInstance : IPontoService
    ) {}

    public async carregarMapa(req: Request, res: Response, next: NextFunction) {
        try{
            console.log(req.body);
            const carregarMapaOrError = await this.pontoServiceInstance.carregarMapa(req.body as ICarregarMapaDTO);
            if (carregarMapaOrError.isFailure) {
                return res.json(carregarMapaOrError.errorValue()).status(402).send();
            }
            const carregarMapaDTO = carregarMapaOrError.getValue();
            res.status(201);
            return res.json( carregarMapaDTO );
        }catch(e){
            return next(e);
        }
    }
}
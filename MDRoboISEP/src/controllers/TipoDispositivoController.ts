import { Inject, Service } from "typedi";
import ITipoDispositivoController from "./IControllers/ITipoDispositivoController";
import { NextFunction, Request, Response } from "express";
import config from "../../config";
import ITipoDispositivoDTO from "../dto/ITipoDispositivoDTO";
import { Result } from "../core/logic/Result";
import ITipoDispositivoService from "../services/IServices/ITipoDispositivoService";

@Service()

export default class TipoDispositivoController implements ITipoDispositivoController{
    constructor(
        @Inject(config.services.tipoDispositivo.name) private tipoDispositivoServiceInstance : ITipoDispositivoService
    ){}
    public async criarTipoDispositivo(req: Request, res: Response, next: NextFunction) {
        try{
          const tipoDispositivoOrError = await this.tipoDispositivoServiceInstance.criarTipoDispositivo(req.body as ITipoDispositivoDTO) as Result<ITipoDispositivoDTO>;
          if (tipoDispositivoOrError.isFailure) {
            return res.json(tipoDispositivoOrError.errorValue()).status(402).send();
          }
          const tipoDispositivoDTO = tipoDispositivoOrError.getValue();
          return res.json( tipoDispositivoDTO ).status(201);
        }catch(e){
          return next(e);
        }
      }
}
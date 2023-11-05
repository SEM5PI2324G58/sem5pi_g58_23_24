import { Inject, Service } from "typedi";
import ITipoDispositivoController from "../IControllers/ITipoDispositivoController";
import { NextFunction, Request, Response } from "express";
import config from "../../../config";
import ITipoDispositivoDTO from "../../dto/ITipoDispositivoDTO";
import { Result } from "../../core/logic/Result";
import ITipoDispositivoService from "../../services/IServices/ITipoDispositivoService";

@Service()

export default class TipoDispositivoController implements ITipoDispositivoController{
    constructor(
        @Inject(config.services.tipoDispositivo.name) private tipoDispositivoServiceInstance : ITipoDispositivoService
    ){}
    public async criarTipoDispositivo(req: Request, res: Response, next: NextFunction) {
        try{
          const tipoDispositivoOrError = await this.tipoDispositivoServiceInstance.criarTipoDispositivo(req.body as ITipoDispositivoDTO) as Result<ITipoDispositivoDTO>;
          if (tipoDispositivoOrError.isFailure) {
            res.status(400);
            return res.json(tipoDispositivoOrError.errorValue());
          }
          const tipoDispositivoDTO = tipoDispositivoOrError.getValue();
          res.status(201);
          return res.json( tipoDispositivoDTO );
        }catch(e){
          return next(e);
        }
      }

  public async deleteTipoDispositivo(req: Request, res: Response, next: NextFunction) {
    try{
      const tipoDispositivoOrError = await this.tipoDispositivoServiceInstance.deleteTipoDispositivo(req.body.idTipoDispositivo);
      if (tipoDispositivoOrError.isFailure) {
        if (String(tipoDispositivoOrError.errorValue()) === "Tipo de dispositivo não existe") {
          res.status(404);
          return res.json(tipoDispositivoOrError.errorValue());
        }
        res.status(400);
        return res.json(tipoDispositivoOrError.errorValue());
      }
      const tipoDispositivoDTO = tipoDispositivoOrError.getValue();
      res.status(200);
      
      return res.json( tipoDispositivoDTO );
      
    }catch(e){
      return next(e);
    }
}
}
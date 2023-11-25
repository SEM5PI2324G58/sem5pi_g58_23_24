import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IPlaneamentoController from '../IControllers/IPlaneamentoController';
import IPlaneamentoService from '../../services/IServices/IPlaneamentoService';

@Service()
export default class PlaneamentoController implements IPlaneamentoController{
  constructor(
      @Inject(config.services.planeamento.name) private pisoServiceInstance : IPlaneamentoService
  ) {}
  
  async encontrarCaminhosEntreEdificios(req: Request, res: Response, next: NextFunction) {
    try {
      const salaInicial = req.query.salaInicial as string;
      const salaFinal = req.query.salaFinal as string;
      const planeamentoOrError = await this.pisoServiceInstance.encontrarCaminhosEntreEdificios(salaInicial, salaFinal);
        
      if (planeamentoOrError.isFailure) {
        let message = String(planeamentoOrError.errorValue());
        if(message === "A sala com o nome" + salaInicial + " não existe" || message === "A sala com o nome" + salaFinal + " não existe"){
          return res.status(404).json( planeamentoOrError.errorValue());
        }
        return res.json( planeamentoOrError.errorValue()).status(400).send();
      }

      const planeamento = planeamentoOrError.getValue();
      res.status(200);
      return res.json( planeamento );
    }
    catch (e) {
      return next(e);
    }
  };

}
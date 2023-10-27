import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IPisoController from './IControllers/IPisoController';
import IPisoService from '../services/IServices/IPisoService';
import ICriarPisoDTO from '../dto/ICriarPisoDTO';
import IPisoDTO from '../dto/IPisoDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class PisoController implements IPisoController {
  constructor(
      @Inject(config.services.piso.name) private pisoServiceInstance : IPisoService
  ) {}

  public async criarPiso(req: Request, res: Response, next: NextFunction) {
    try {
      const pisoOrError = await this.pisoServiceInstance.criarPiso(req.body as ICriarPisoDTO);
        
      if (pisoOrError.isFailure) {
        return res.json( pisoOrError.errorValue()).status(402).send();
      }

      const criarPisoDTO = pisoOrError.getValue();
      return res.json( criarPisoDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async listarTodosOsPisosDeUmEdificio(req: Request, res: Response, next: NextFunction) {
    try {
      const pisoOrError = await this.pisoServiceInstance.listarTodosOsPisosDeUmEdificio(req.body.codigo);
        
      if (pisoOrError.isFailure) {
        return res.json( pisoOrError.errorValue()).status(402).send();
      }

      const pisoDTO = pisoOrError.getValue();
      return res.json( pisoDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };
}
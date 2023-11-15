import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IPisoController from '../IControllers/IPisoController';
import IPisoService from '../../services/IServices/IPisoService';
import ICriarPisoDTO from '../../dto/ICriarPisoDTO';
import IPisoDTO from '../../dto/IPisoDTO';

import { Result } from "../../core/logic/Result";
import IEditarPisoDTO from '../../dto/IEditarPisoDTO';

@Service()
export default class PisoController implements IPisoController {
  constructor(
      @Inject(config.services.piso.name) private pisoServiceInstance : IPisoService
  ) {}

  public async criarPiso(req: Request, res: Response, next: NextFunction) {
    try {
      const pisoOrError = await this.pisoServiceInstance.criarPiso(req.body as ICriarPisoDTO);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.body.codigo +" não existe"){
          res.status(404);
          return res.json( pisoOrError.errorValue());
        }
        return res.status(400).json( pisoOrError.errorValue());
      }

      const criarPisoDTO = pisoOrError.getValue();
      res.status(201);
      return res.json( criarPisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async listarTodosOsPisosDeUmEdificio(req: Request, res: Response, next: NextFunction) {
    try {
      const pisoOrError = await this.pisoServiceInstance.listarTodosOsPisosDeUmEdificio(req.query.codigo as string);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.query.codigo +" não existe" || message === "Não existem pisos nesse Edificio"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        return res.json( pisoOrError.errorValue()).status(400).send();
      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async editarPiso(req: Request, res: Response, next: NextFunction) {
    try {
      const pisoOrError = await this.pisoServiceInstance.editarPiso(req.body as IEditarPisoDTO);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.body.codigoEdificio +" não existe" || 
              message === "O piso com o número " + req.body.numeroPiso +" não existe"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        res.status(400);
        return res.json( pisoOrError.errorValue()).send();

      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
  }catch (e) {
      return next(e);
  }
  }
}
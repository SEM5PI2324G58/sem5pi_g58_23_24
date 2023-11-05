import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPassagemController from './IControllers/IPassagemController';
import IPassagemService from '../services/IServices/IPassagemService';
import IPassagemDTO from '../dto/IPassagemDTO';
import IListarPassagensPorParDeEdificioDTO from '../dto/IListarPassagensPorParDeEdificioDTO';
import IListarPassagemDTO from '../dto/IListarPassagemDTO';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IListarPisoComPassagensDTO from '../dto/IListarPisoComPassagensDTO';

@Service()
export default class PassagemController implements IPassagemController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.passagem.name) private passagemServiceInstance : IPassagemService
  ) {}
  public async editarPassagens(req: Request, res: Response, next: NextFunction) {
    try {
      const passagemOrError = await this.passagemServiceInstance.editarPassagens(req.body as IPassagemDTO) as Result<IPassagemDTO>;
      if (passagemOrError.isFailure) {
        let message = String(passagemOrError.errorValue());
    if (message === "Edificio A não existe" || message === "Edificio B não existe" || message === "Piso A não existe" || message === "Piso B não existe" || message === "A passagem com o id "+req.body.id+" não existe") {
          res.status(404);
          return res.json(passagemOrError.errorValue());
        }
        return res.status(400).json(passagemOrError.errorValue());
      }
      const passagemDTO = passagemOrError.getValue();
      res.status(200);
      return res.json( passagemDTO );
    } catch (e) {
      return next(e);
    }
  }

  public async listarPisosComPassagens(req: Request, res: Response, next: NextFunction) {
    try{
      const passagemOrError = await this.passagemServiceInstance.listarPisosComPassagens();
      if (passagemOrError.isFailure) {
        return res.status(400).json(passagemOrError.errorValue());
      }
      const passagemDTO = passagemOrError.getValue();
      res.status(200);
      return res.json( passagemDTO );
    }catch(e){
      return next(e);
    }
  }

  public async criarPassagem(req: Request, res: Response, next: NextFunction) {
    try{
      const passagemOrError = await this.passagemServiceInstance.criarPassagem(req.body as IPassagemDTO) as Result<IPassagemDTO>;
      if (passagemOrError.isFailure) {
        let message = String(passagemOrError.errorValue());
        if (message === "Edificio A não existe" || message === "Edificio B não existe" || message === "Piso A não existe" || message === "Piso B não existe") {
          res.status(404);
          return res.json(passagemOrError.errorValue());
        }
        return res.status(400).json(passagemOrError.errorValue());
      }
      const passagemDTO = passagemOrError.getValue();
      res.status(201);
      return res.json( passagemDTO );
    }catch(e){
      return next(e);
    }
  }

  public async listarPassagensPorParDeEdificios(req: Request, res: Response, next: NextFunction) {
    try{
      
      const passagemOrError = await this.passagemServiceInstance.listarPassagensPorParDeEdificios(req.body as IListarPassagensPorParDeEdificioDTO) as Result<IListarPassagemDTO[]>;
      
      if (passagemOrError.isFailure) {
        let erro = String(passagemOrError.errorValue());
        if (erro === "Edificio A não existe" || erro === "Edificio B não existe") {
          res.status(404);
          return res.json(passagemOrError.errorValue());
        }
        res.status(400);
        return res.json(passagemOrError.errorValue());
      }

      const passagemDTO = passagemOrError.getValue();
      res.status(200);
      return res.json(passagemDTO);

    }catch(e){
      return next(e);
    }
  }
}
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
        return res.json(passagemOrError.errorValue()).status(402).send();
      }
      const passagemDTO = passagemOrError.getValue();
      return res.json( passagemDTO ).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async listarPisosComPassagens(req: Request, res: Response, next: NextFunction) {
    try{
      const passagemOrError = await this.passagemServiceInstance.listarPisosComPassagens();
      if (passagemOrError.isFailure) {
        return res.json(passagemOrError.errorValue()).status(402).send();
      }
      const passagemDTO = passagemOrError.getValue();
      return res.json( passagemDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }

  public async criarPassagem(req: Request, res: Response, next: NextFunction) {
    try{
      const passagemOrError = await this.passagemServiceInstance.criarPassagem(req.body as IPassagemDTO) as Result<IPassagemDTO>;
      if (passagemOrError.isFailure) {
        return res.json(passagemOrError.errorValue()).status(402).send();
      }
      const passagemDTO = passagemOrError.getValue();
      return res.json( passagemDTO ).status(201);
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
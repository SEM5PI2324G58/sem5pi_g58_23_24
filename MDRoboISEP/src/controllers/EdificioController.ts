import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IEdificioController from './IControllers/IEdificioController';
import IEdificioService from '../services/IServices/IEdificioService';
import IEdificioDTO from '../dto/IEdificioDTO';
import IListarEdMinEMaxPisosDTO from '../dto/IListarEdMinEMaxPisosDTO';

@Service()
export default class EdificioController implements IEdificioController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.edificio.name) private edificioServiceInstance : IEdificioService
  ) {}

  public async criarEdificio(req: Request, res: Response, next: NextFunction) {
    try{
      const edificioOrError = await this.edificioServiceInstance.criarEdificio(req.body as IEdificioDTO) as Result<IEdificioDTO>;
      if (edificioOrError.isFailure) {
        return res.json(edificioOrError.errorValue()).status(402).send();
      }
      const edificioDTO = edificioOrError.getValue();
      return res.json( edificioDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }

  
  public async listarEdificioMinEMaxPisos(req: Request, res: Response, next: NextFunction) {
    try{
      const edificioOrError = await this.edificioServiceInstance.listarEdificioMinEMaxPisos(req.body as IListarEdMinEMaxPisosDTO) as Result<IEdificioDTO[]>;
      if (edificioOrError.isFailure) {
        return res.json(edificioOrError.errorValue()).status(402).send();
      }
      const edificioDTO = edificioOrError.getValue();
      return res.json( edificioDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }

  public async listarEdificios(req: Request, res: Response, next: NextFunction) {
    try{
      const listaEdificiosOrError = await this.edificioServiceInstance.listarEdificios() as Result<IEdificioDTO[]>;
      if (listaEdificiosOrError.isFailure) {
        return res.json(listaEdificiosOrError.errorValue()).status(402).send();
      }
      const listaEdificiosDTO = listaEdificiosOrError.getValue();
      return res.json( listaEdificiosDTO ).status(201);
    }catch(e){
    return next(e);
    }
  }

  public async editarEdificio(req: Request, res: Response, next: NextFunction){
    try{
      const edificioOrError = await this.edificioServiceInstance.editarEdificio(req.body as IEdificioDTO) as Result<IEdificioDTO>;
      if (edificioOrError.isFailure) {
        return res.json(edificioOrError.errorValue()).status(402).send();
      }
      const edificioDTO = edificioOrError.getValue();
      return res.json( edificioDTO ).status(201);
    }catch(e){
      throw next(e);
    }
  }
}
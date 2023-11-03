import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import ISalaController from './IControllers/ISalaController';
import ISalaService from '../services/IServices/ISalaService';
import ISalaDTO from '../dto/ISalaDTO';

@Service()
export default class SalaController implements ISalaController {
  constructor(
      @Inject(config.services.sala.name) private salaServiceInstance : ISalaService
  ) {}

  public async criarSala(req: Request, res: Response, next: NextFunction) {
    try{
      const salaOrError = await this.salaServiceInstance.criarSala(req.body as ISalaDTO) as Result<ISalaDTO>;
      if (salaOrError.isFailure) {
        return res.json(salaOrError.errorValue()).status(402).send();
      }
      const salaDTO = salaOrError.getValue();
      return res.json( salaDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }
}
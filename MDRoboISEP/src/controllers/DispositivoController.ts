import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IDispositivoController from './IControllers/IDispositivoController';
import IDispositivoDTO from '../dto/IDispositivoDTO';
import IDispositivoService from '../services/IServices/IDispositivoService';
import IAdicionarRoboAFrotaDTO from '../dto/IAdicionarRoboAFrotaDTO';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IDispositivoInibirDTO from '../dto/IDispositivoInibirDTO';

@Service()
export default class DispositivoController implements IDispositivoController {
  constructor(
      @Inject(config.services.dispositivo.name) private dispositivoServiceInstance : IDispositivoService
  ) {}
  public async inibirDispositivo(req: Request, res: Response, next: NextFunction) {
    try{
      const dispositivoOrError = await this.dispositivoServiceInstance.inibirDispositivo(req.body as IDispositivoInibirDTO);
      if (dispositivoOrError.isFailure) {
        return res.json(dispositivoOrError.errorValue()).status(402).send();
      }
      const dispositivoDTO = dispositivoOrError.getValue();
      return res.json( dispositivoDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }

  public async adicionarDispositivoAFrota(req: Request, res: Response, next: NextFunction) {
    try{
      const dispositivoOrError = await this.dispositivoServiceInstance.adicionarDispositivoAFrota(req.body as IAdicionarRoboAFrotaDTO) as Result<IDispositivoDTO>;
      if (dispositivoOrError.isFailure) {
        return res.json(dispositivoOrError.errorValue()).status(402).send();
      }
      const dispositivoDTO = dispositivoOrError.getValue();
      return res.json( dispositivoDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }

  public async listarDispositivosDaFrota(req: Request, res: Response, next: NextFunction) {
    try{
      const dispositivoOrError = await this.dispositivoServiceInstance.listarDispositivosDaFrota() as Result<IDispositivoDTO[]>;
      if (dispositivoOrError.isFailure) {
        return res.json(dispositivoOrError.errorValue()).status(402).send();
      }
      const dispositivoDTO = dispositivoOrError.getValue();
      return res.json( dispositivoDTO ).status(201);
    }catch(e){
      return next(e);
    }
  }
}
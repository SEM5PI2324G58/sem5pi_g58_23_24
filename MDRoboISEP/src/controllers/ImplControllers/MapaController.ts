import {Request, Response, NextFunction} from "express";
import IMapaController from "../IControllers/IMapaController";
import IMapaService from "../../services/IServices/IMapaService";
import config from "../../../config";
import { Inject, Service } from "typedi";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import { Result } from "../../core/logic/Result";

@Service()
export default class MapaController implements IMapaController {
    constructor(
        @Inject(config.services.mapa.name) private mapaServiceInstance : IMapaService
    ) {}

    public async carregarMapa(req: Request, res: Response, next: NextFunction) {
        try{
            let mapaOrError = await this.mapaServiceInstance.carregarMapa(req.body as ICarregarMapaDTO);
            if(mapaOrError.isFailure){
                let erro = String(mapaOrError.errorValue());
                if(erro === "O Edifício que inseriu não existe." || erro === "O piso que inseriu não existe." ||
                erro === "Não existem passagens que satisfaçam os dados inseridos" ||
                erro === "Não existem salas que satisfaçam os dados inseridos" ||
                erro === "Não existe elevador neste edifício."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(mapaOrError.errorValue());
            }
            const mapaDTO = mapaOrError.getValue();
            res.status(201);
            return res.json(mapaDTO).send();
        }catch(e){
            return next(e);
        }
    }
}
import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IEdificioController from '../../controllers/IControllers/IEdificioController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/tipoDispositivo', route);

  const ctrl = Container.get(config.controllers.edificio.name) as IEdificioController;

  route.post('',
    celebrate({
        body: Joi.object({
        tipoTarefa: Joi.array().items(Joi.string()).required().min(1),
        marca: Joi.string().required(),
        modelo: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.criarEdificio(req, res, next));
};
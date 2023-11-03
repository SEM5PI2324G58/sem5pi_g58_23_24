import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPassagemController from '../../controllers/IControllers/IPassagemController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/Passagem', route);

  const ctrl = Container.get(config.controllers.passagem.name) as IPassagemController;

  route.post('',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        codigoEdificioA: Joi.string().required(),
        codigoEdificioB: Joi.string().required(),
        numeroPisoA: Joi.number().required(),
        numeroPisoB: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.criarPassagem(req, res, next));

  route.get('/listarPassagensPorParDeEdificios',
    celebrate({
      body: Joi.object({
        edificioACod: Joi.string(),
        edificioBCod: Joi.string(),
      })
    }),
    (req, res, next) => ctrl.listarPassagensPorParDeEdificios(req, res, next));
};
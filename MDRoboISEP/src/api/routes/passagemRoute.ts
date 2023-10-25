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
        codigo: Joi.string().required(),
        nome: Joi.string(),
        descricao: Joi.string(),
        dimensaoX: Joi.number().required(),
        dimensaoY: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.criarPassagem(req, res, next));
};
import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPisoController from '../../controllers/IControllers/IPisoController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/piso', route);

  const ctrl = Container.get(config.controllers.piso.name) as IPisoController;

  route.post('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        numeroPiso: Joi.number().required(),
        descricaoPiso: Joi.string()
      })
    }),
    (req, res, next) => ctrl.criarPiso(req, res, next) );
  
    route.get('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.listarTodosOsPisosDeUmEdificio(req, res, next) );
  
};
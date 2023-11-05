import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPisoController from '../../controllers/IControllers/IPisoController'; 

import config from "../../../config";
import IPontoController from '../../controllers/IControllers/IPontoController';

const route = Router();

export default (app: Router) => {
    app.use('/mapa', route);
  
    const ctrl = Container.get(config.controllers.ponto.name) as IPontoController;
  
    route.patch('',
      celebrate({
        body: Joi.object({
            codigoEdificio: Joi.string().required(),
            numeroPiso: Joi.number().required(),
            passagens : Joi.array().items(Joi.object({
                id : Joi.number().required(),
                abcissa : Joi.number().required(),
                ordenada : Joi.number().required(),
                orientacao : Joi.string().required()
            })),
            elevador : Joi.object({
                xCoord : Joi.number().required(),
                yCoord : Joi.number().required(),
                orientacao : Joi.string().required()
            }),
            salas : Joi.array().items(Joi.object({
                nome : Joi.string().required(),
                abcissaA : Joi.number().required(),
                ordenadaA : Joi.number().required(),
                abcissaB : Joi.number().required(),
                ordenadaB : Joi.number().required(),
                abcissaPorta : Joi.number().required(),
                ordenadaPorta : Joi.number().required(),
                orientacaoPorta : Joi.string().required()
            }))
        })
      }),
      (req, res, next) => ctrl.carregarMapa(req, res, next) );
    
  };
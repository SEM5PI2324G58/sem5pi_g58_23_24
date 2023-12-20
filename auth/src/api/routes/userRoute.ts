import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import IUserController from '../../controllers/IControllers/IUserController';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  const ctrl = Container.get(config.controllers.user.name) as IUserController;

  route.post('/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        telefone: Joi.string().required(),
        nif: Joi.string(),
        password: Joi.string().required(),
        estado: Joi.string().required(),
        role: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.signup(req, res, next));
  
    route.get('/login',
    celebrate({
      query: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.login(req, res, next));
  
  route.post('/signupUtente',
      celebrate({
        body: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().required(),
          telefone: Joi.string().required(),
          nif: Joi.string().required(),
          password: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.signupUtente(req, res, next));

    route.delete('',
    celebrate({
      query: Joi.object({
        email: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.delete(req, res, next));
};
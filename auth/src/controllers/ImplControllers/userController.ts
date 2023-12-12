import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IUserController from '../IControllers/IUserController';
import IUserService from '../../services/IServices/IUserService';
import { IUserDTO } from '../../dto/IUserDTO';
import { ISignupUtenteDTO } from '../../dto/ISignupUtenteDTO';

@Service()
export default class UserController implements IUserController {
  constructor(
      @Inject(config.services.user.name) private userServiceInstance : IUserService
  ) {}
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const userOrError = await this.userServiceInstance.SignIn(email, password);
            if (userOrError.isFailure) {
              let message = String(userOrError.errorValue());
              if (message === "User not found") {
                res.status(404);
                return res.json( userOrError.errorValue());
              }
              return res.status(400).json( userOrError.errorValue());
            }
      
            const userDTO = userOrError.getValue();
            return res.json( userDTO );
          }
          catch (e) {
            return next(e);
          }
    }
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const userOrError = await this.userServiceInstance.SignUp(req.body as IUserDTO);
              
            if (userOrError.isFailure) {
              let message = String(userOrError.errorValue());
              if(message === "O utilizador com a informação fornecida já existe") {
                res.status(404);
                return res.json( userOrError.errorValue());
              }
              return res.status(400).json( userOrError.errorValue());
            }
      
            const userDTO = userOrError.getValue();
            res.status(201);
            return res.json( userDTO );
          }
          catch (e) {
            return next(e);
          }
    }

    async signupUtente(req: Request, res: Response, next: NextFunction) {
      try {
          const userOrError = await this.userServiceInstance.signupUtente(req.body as ISignupUtenteDTO);
            
          if (userOrError.isFailure) {            
            return res.status(400).json( userOrError.errorValue());
          }
          const userDTO = userOrError.getValue();
          res.status(201);
          return res.json( userDTO );
        }
        catch (e) {
          return next(e);
        }
  }

}
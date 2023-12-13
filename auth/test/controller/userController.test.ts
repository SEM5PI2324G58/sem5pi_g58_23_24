import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { UserPassword } from '../../src/domain/userPassword';
import { UserEmail } from '../../src/domain/userEmail';
import { Role } from '../../src/domain/role';
import { User } from '../../src/domain/user';
import { UserEstado } from '../../src/domain/userEstado';
import { UserNumeroContribuinte } from '../../src/domain/userNumeroContribuinte';
import { UserName } from '../../src/domain/userName';
import { UserTelefone } from '../../src/domain/userTelefone';
import { UserId } from '../../src/domain/userId';
import { ISignupUtenteDTO } from '../../src/dto/ISignupUtenteDTO';
import UserService  from '../../src/services/ImplServices/userService';
import IUserRepo from '../../src/services/IRepos/IUserRepo';
import { Request, Response, NextFunction } from 'express';
import UserController from '../../src/controllers/ImplControllers/UserController';
import { Result } from '../../src/core/logic/Result';


import "reflect-metadata";

import 'mocha';
import IUserService from "../../src/services/IServices/IUserService";


describe('User Controller ', () => {

    const sandbox = sinon.createSandbox();
    
    beforeEach(function() {
        Container.reset();
        this.timeout(10000);
        let dispositivoSchemaInstance = require('../../src/persistence/schemas/userSchema').default;
        Container.set("userSchema", dispositivoSchemaInstance);
       
        let userRepoClass = require('../../src/repos/userRepo').default;
        let userRepoInstance = Container.get(userRepoClass);
        Container.set("UserRepo", userRepoInstance);

        let userServiceClass = require('../../src/services/ImplServices/userService').default;
        let userServiceInstance = Container.get(userServiceClass);
        Container.set("UserService", userServiceInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });


    it('signupUtente com sucesso', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "password10@"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let userServiceInstance = Container.get("UserService");

        sinon.stub(userServiceInstance, "signupUtente").returns(Result.ok<string>("Conta criada com sucesso!"));
        

        const userController = new UserController(userServiceInstance as IUserService);

        let answer = await userController.signupUtente(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "Conta criada com sucesso!");
        
    });

    it('signupUtente falha', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "password10@"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let userServiceInstance = Container.get("UserService");

        sinon.stub(userServiceInstance, "signupUtente").returns(Result.fail<string>("Já existe um utilizador com esse email"));
        

        const userController = new UserController(userServiceInstance as IUserService);

        let answer = await userController.signupUtente(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 400);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "Já existe um utilizador com esse email");
        
    });


    it('signupUtente com sucesso Controller + Service', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "password10@"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let signupDTO = {
            name: "Marco Antonio",
            email: "Marcoantonio@isep.ipp.pt",
            telefone: "914231321",
            nif: "321123567",
            password: "password10@"
        };

        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(body.password, { salt });
        let userProps = {
            name: UserName.create(body.name).getValue(),
            email: UserEmail.create(body.email).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: UserPassword.create({ value: hashedPassword, hashed: true }).getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserId.create(1).getValue()).getValue();

        let userService = Container.get("UserService");
        const userServiceSpy = sinon.spy(userService, 'signupUtente');

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "maxId").returns(Promise.resolve(0));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));
        

        const userController = new UserController(userService as IUserService);

        let answer = await userController.signupUtente(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(userServiceSpy);
        sinon.assert.calledWith(userServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "Conta criada com sucesso!");
        
    });

   

    


});
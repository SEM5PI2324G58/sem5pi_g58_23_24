import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { UserPassword } from '../../src/domain/user/userPassword';
import { UserEmail } from '../../src/domain/user/userEmail';
import { Role } from '../../src/domain/user/role';
import { User } from '../../src/domain/user/user';
import { UserEstado } from '../../src/domain/user/userEstado';
import { UserNumeroContribuinte } from '../../src/domain/user/userNumeroContribuinte';
import { UserName } from '../../src/domain/user/userName';
import { UserTelefone } from '../../src//domain/user/userTelefone';
import { Request, Response, NextFunction } from 'express';
import UserController from '../../src/controllers/ImplControllers/UserController';
import { Result } from '../../src/core/logic/Result';


import "reflect-metadata";

import 'mocha';
import IUserService from "../../src/services/IServices/IUserService";
import { IUpdateUserDTO } from '../../src/dto/IUpdateUserDTO';


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


    it ('signup com sucesso', async () => {
            
            let body = {
                "name": "Marco Antonio",
                "email": "marco@isep.ipp.pt",
                "telefone": "914231321",
                "nif": "321123567",
                "password": "Password10@"
            };
            let req: Partial<Request> = {};
            req.body = body;
            let res: Partial<Response> = {
                status: sinon.spy(),
                json: sinon.spy()
            };
            let next: Partial<NextFunction> = () => {};
            let userServiceInstance = Container.get("UserService");
            sinon.stub(userServiceInstance, "SignUp").returns(Result.ok<string>("Conta criada com sucesso!"));
            const userController = new UserController(userServiceInstance as IUserService);
            let answer = await userController.signup(<Request>req, <Response>res, <NextFunction>next);
            sinon.assert.calledOnce(res.status as sinon.SinonSpy);
            sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
            sinon.assert.calledOnce(res.json as sinon.SinonSpy);
            sinon.assert.calledWith(res.json as sinon.SinonSpy, "Conta criada com sucesso!");
    });

    it ('signup Controller + Service com sucesso', async () => {
            
        let body = {
            "name": "Marco Antonio",
            "email": "marco@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "Password10@",
            "estado": "aceito",
            "role": "admin"
        };
        
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        const hashedPassword = await UserPassword.create({ value: body.password });
        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userService = Container.get("UserService");
        const userServiceSpy = sinon.spy(userService, 'SignUp');

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));

        const userController = new UserController(userService as IUserService);
        let answer = await userController.signup(<Request>req, <Response>res, <NextFunction>next);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "Conta criada com sucesso!");
});


    it('signupUtente com sucesso', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "Password10@"
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
            "password": "Password10@"
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
            "password": "Password10@"
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
            password: "Password10@"
        };

        const hashedPassword = await UserPassword.create({ value: signupDTO.password });
        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userService = Container.get("UserService");
        const userServiceSpy = sinon.spy(userService, 'signupUtente');

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
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
    
    /*it('ApproveOrRejectUtente com sucesso', async () => {
            
        let body = {
            email: "marco@isep.ipp.pt",
            estado : "aceito"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(body.email).getValue());

        let userServiceInstance = Container.get("UserService");

        sinon.stub(userServiceInstance, "approveOrRejectSignUp").returns(Result.ok<string>("Estado do utilizador alterado com sucesso!"));
        
        const userController = new UserController(userServiceInstance as IUserService);

        let answer = await userController.approveOrRejectSignUp(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "Estado do utilizador alterado com sucesso!");
    });*/

    it('alterarDadosUserController sucesso', async () => {

        let body = {
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "nome" : "MarcoNov0"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let userServiceInstance = Container.get("UserService");

        sinon.stub(userServiceInstance, "alterarDadosUser").returns(Result.ok<IUpdateUserDTO>(body));
        

        const userController = new UserController(userServiceInstance as IUserService);

        let answer = await userController.alterarDadosUser(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
        
    });

    it('alterarDadosUserController falha quando nif inválido', async () => {

        let body = {
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "nif",
            "nome" : "MarcoNov0"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let userServiceInstance = Container.get("UserService");

        sinon.stub(userServiceInstance, "alterarDadosUser").returns(Result.fail<IUpdateUserDTO>("O numero de contribuinte tem que ter 9 digitos."));
        

        const userController = new UserController(userServiceInstance as IUserService);

        let answer = await userController.alterarDadosUser(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 400);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "O numero de contribuinte tem que ter 9 digitos.");
        
    });


    it('alterarDadosUtente com sucesso Controller + Service', async () => {

        let body = {
            "email": "Marcoantonio@isep.ipp.pt",
            "telefone": "914444555",
            "nif": "999888999",
            "nome" : "MarcoNov0"
        };

        let req: Partial<Request> = {};
        
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        const hashedPassword = await UserPassword.create({ value: "Password10@" });
        
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("marco@isep.ipp.pt").getValue()).getValue();

        let userService = Container.get("UserService");
        const userServiceSpy = sinon.spy(userService, 'alterarDadosUser');

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));
        

        const userController = new UserController(userService as IUserService);

        let answer = await userController.alterarDadosUser(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(userServiceSpy);
        sinon.assert.calledWith(userServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
        
    });
});
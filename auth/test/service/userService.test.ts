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


import "reflect-metadata";

import 'mocha';


describe('Tipo Dispositivo Service ', () => {

    const sandbox = sinon.createSandbox();
    
    beforeEach(function() {
        Container.reset();
        this.timeout(10000);
        let dispositivoSchemaInstance = require('../../src/persistence/schemas/userSchema').default;
        Container.set("userSchema", dispositivoSchemaInstance);
       
        let userRepoClass = require('../../src/repos/userRepo').default;
        let userRepoInstance = Container.get(userRepoClass);
        Container.set("UserRepo", userRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });


    it('signupUtente com sucesso', async () => {

        let body = {
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

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "maxId").returns(Promise.resolve(0));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo, null);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Conta criada com sucesso!").to.equal(answer.getValue());
        
    });

    it('signupUtente falha porque o email já existe', async () => {

        let body = {
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

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo, null);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Já existe um utilizador com esse email").to.equal(answer.errorValue());
        
    });

    


});
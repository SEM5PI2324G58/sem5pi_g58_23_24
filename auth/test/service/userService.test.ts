import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { UserPassword } from '../../src/domain/user/userPassword';
import { UserEmail } from '../../src/domain/user/userEmail';
import { Role } from '../../src/domain/user/role';
import { User } from '../../src/domain/user/user';
import { UserEstado } from '../../src/domain/user/userEstado';
import { UserNumeroContribuinte } from '../../src/domain/user/userNumeroContribuinte';
import { UserName } from '../../src/domain/user/userName';
import { UserTelefone } from '../../src/domain/user/userTelefone';
import { ISignupUtenteDTO } from '../../src/dto/ISignupUtenteDTO';
import UserService  from '../../src/services/ImplServices/userService';
import IUserRepo from '../../src/services/IRepos/IUserRepo';


import "reflect-metadata";

import 'mocha';


describe('User Service ', () => {

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
            password: "Password10@"
        };

        const hashedPassword = await UserPassword.create({ value: body.password })

        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Conta criada com sucesso!").to.equal(answer.getValue());
        
    });

    it('signupUtente falha porque o email já existe', async () => {

        let body = {
            name: "Marco Antonio",
            email: "Marcoantonio@isep.ipp.pt",
            telefone: "914231321",
            nif: "321123567",
            password: "Password10@"
        };

        const hashedPassword = await UserPassword.create({ value: body.password })

        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Já existe um utilizador com esse email").to.equal(answer.errorValue());
        
    });

});
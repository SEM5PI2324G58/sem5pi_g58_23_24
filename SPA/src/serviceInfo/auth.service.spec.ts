import { devEnvironment } from 'src/environments/environment.development';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Utilizador } from 'src/dataModel/utilizador';
import { of } from 'rxjs';

describe('AuthService', () => {

  let service: AuthService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });




  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método signupUtente chama o método post do HttpClient', () => {
    const testData = {
        name: "name",
        email: "email@isep.ipp.pt",
        telefone: "123432123",
        password: "Password10@",
        nif: "123123123",
    
    }
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.signupUtente(testData.name,testData.email,testData.telefone,testData.nif,testData.password);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + 'user/signupUtente',testData, service.httpOptions);
  });

  it('Método signupUtente não chama o método post do HttpClient caso haja dados por preencher', () => {
    let name: string = "";
    const testData = {
        email: "email@isep.ipp.pt",
        telefone: "123432123",
        password: "Password10@",
        nif: "123123123",
    
    }
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.signupUtente(name,testData.email,testData.telefone,testData.nif,testData.password);
    expect(postSpy).toHaveBeenCalledTimes(0);
  });
});

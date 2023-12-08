import { devEnvironment } from 'src/environments/environment.development';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContaService } from './conta.service';
import { HttpClient } from '@angular/common/http';
import { Utilizador } from 'src/dataModel/utilizador';
import { of } from 'rxjs';

describe('ContaService', () => {

  let service: ContaService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ContaService);
    httpClient = TestBed.inject(HttpClient);
  });




  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método exportarDadosPessoais chama o método get do HttpClient', () => {
    const testData: Utilizador = {role: "role", email: "email", password: "password", estado: "estado", nome: "nome", telefone: 123456789, contribuinte: 123456789};

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.exportarDadosPessoais();
    expect(getSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'conta', service.httpOptions);
  });
});

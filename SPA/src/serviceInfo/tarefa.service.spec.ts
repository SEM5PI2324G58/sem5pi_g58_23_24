import { TestBed } from '@angular/core/testing';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { devEnvironment } from 'src/environments/environment.development';

import { TarefaService } from './tarefa.service';
import Tarefa from 'src/dataModel/tarefa';
import AlterarEstadoDaTarefa from 'src/dataModel/alterarEstadoDaTarefa';

describe('TarefaService', () => { 
  let service: TarefaService;
  const tarefaUrl = devEnvironment.MDTarefas_API_URL + 'Tarefa';
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(TarefaService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método alterarEstadoTarefa chama o método PUT do HttpClient quando o estado é aceite', () => {

    const testDataInsert = {
      Id: "1",
      CodigoRobo: "codigoRobo",
      Estado: "Aceite",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString:"percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
      } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);
    
    expect(putSpy).toHaveBeenCalledWith(tarefaUrl,testDataInsert,service.httpOptions);
  });

  
  it('Método alterarEstadoTarefa chama o método PUT do HttpClient quando o estado é rejeitada', () => {

    const testDataInsert = {
      Id: "1",
      Estado: "Rejeitada",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Rejeitada",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString:"percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
      } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);
    
    expect(putSpy).toHaveBeenCalledWith(tarefaUrl,testDataInsert,service.httpOptions);
  });

  
  it('Método alterarEstadoTarefa não chama o método PUT do HttpClient quando o id esta vazio', () => {

    const testDataInsert = {
      Id: "",
      CodigoRobo: "codigoRobo",
      Estado: "Aceite",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString:"percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
      } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);
    
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método alterarEstadoTarefa não chama o método PUT do HttpClient quando o estado esta vazio', () => {

    const testDataInsert = {
      Id: "1",
      CodigoRobo: "codigoRobo",
      Estado: "",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString:"percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
      } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);
    
    expect(putSpy).not.toHaveBeenCalled();
  });


});

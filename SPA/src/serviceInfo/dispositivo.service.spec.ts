import { TestBed } from '@angular/core/testing';

import { DispositivoService } from './dispositivo.service';
import { HttpClient } from '@angular/common/http';
import { devEnvironment } from 'src/environments/environment.development';
import { Dispositivo } from 'src/dataModel/dispositivo';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';


describe('DispositivoServiceService', () => {
  let service: DispositivoService;
  let httpClient: HttpClient;

  const dispositivoUrl = devEnvironment.MDRI_API_URL + 'dispositivo';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(DispositivoService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método listarDispositivosFrota chama o método get do HttpClient', () => {
    const testData: Dispositivo = {
      tipoDispositivo: 1,
      codigo: 'cod',
      descricaoDispositivo: 'desc',
      estado: true,
      nickname: 'nick',
      numeroSerie: '123'
    };

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.listarDispositivosFrota();
    expect(getSpy).toHaveBeenCalled();
  });
});

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';


import CarregarMapa from 'src/dataModel/carregarMapa';
import { MessageService } from './message.service';
import ExportarMapa from 'src/dataModel/exportarMapa';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private http: HttpClient, private messageService:MessageService) { }

  private mapaUrl = devEnvironment.MDRI_API_URL + 'mapa';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public carregarMapa(mapa : CarregarMapa): void {

    this.http.patch<CarregarMapa>(this.mapaUrl, mapa, this.httpOptions)
    .pipe(catchError(this.handleError<CarregarMapa>('Carregar Mapa')))
    .subscribe(data => {
      this.log(`Mapa do piso ${data.numeroPiso} do Edifício ${data.codigoEdificio} carregado com sucesso!`);
    });
  }

  public exportarMapa(codigo: string,numeroPiso: number): Observable<ExportarMapa> {
    let params = new HttpParams().set('codEdificio', codigo);
    params = params.append('numPiso', numeroPiso.toString());
    
    return this.http.get<ExportarMapa>(this.mapaUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<ExportarMapa>('Exportar Mapa'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      

      this.log(`${operation} falhou: ${error.error}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }
}

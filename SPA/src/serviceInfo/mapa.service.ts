import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import CarregarMapa from 'src/dataModel/carregarMapa';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private http: HttpClient, private messageService:MessageService) { }

  private mapaUrl = 'http://localhost:4000/api/mapa';

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

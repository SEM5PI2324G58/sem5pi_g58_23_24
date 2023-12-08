import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Utilizador } from '../dataModel/utilizador';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private contaUrl = devEnvironment.MDRI_API_URL + 'conta';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }

  public exportarDadosPessoais(): Observable<Utilizador> {
    return this.http.get<Utilizador>(this.contaUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<Utilizador>('Exportar Dados Pessoais'))
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

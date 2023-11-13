import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Edificio } from '../dataModel/edificio';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {

  private edificioUrl = 'http://localhost:4000/api/edificio';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }

  public listarCodEdificios(): string[]{
    return this.listarEdificioCod();
  }



  private listarEdificioCod(): string[]{
    let listaCodigos: string[];
    listaCodigos = [];
    
    this.http.get<Edificio[]>(this.edificioUrl, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio[]>('Listar Edificio')))
    .subscribe(data => {
        const codigos = data.map(item => item.codigo);
        listaCodigos.push(...codigos);
    });
    return listaCodigos; 
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

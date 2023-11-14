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

  public criarEdificio(codigo: string, dimensaoX: string, dimensaoY: string,
    nome?: string, descricao?: string): void {
    let dimensaoXNumero: number = +dimensaoX;
    let dimensaoYNumero: number = +dimensaoY;
    if(this.validateString(codigo) === false){
      this.log("Código não pode ser vazio");
      return;
    }

    if(this.validateNumber(dimensaoX, "Dimensão X") === false){
      return;
    }

    if(this.validateNumber(dimensaoY, "Dimensão Y") === false){
      return;
    }

    let edificio: any = {
      codigo: codigo,
      dimensaoX: dimensaoXNumero,
      dimensaoY: dimensaoYNumero,
    };
    if(nome && this.validateString(nome)){
      edificio.nome = nome;
    }
    if(descricao && this.validateString(descricao)){
      edificio.descricao = descricao;
    }

    this.http.post<Edificio>(this.edificioUrl, edificio as Edificio, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio>('Criar Edificio')))
    .subscribe(data => {
      this.log(`Edificio com código: ${data.codigo} criado com sucesso!`);
    });
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

  

  public editarEdificio(codigo: string, nome?: string, descricao?: string): void {
    if(this.validateString(codigo) === false){
      this.log("Código não pode ser vazio");
      return;
    }

    let edificio: any = {
      codigo: codigo,
    };
    let um = false;
    if(nome && this.validateString(nome)){
      edificio.nome = nome;
      um = true;
    }
    if(descricao && this.validateString(descricao)){
      edificio.descricao = descricao;
      um = true;
    }

    if(um === false){
      this.log("Nenhum campo para atualizar");
      return;
    }

    this.http.put<Edificio>(this.edificioUrl, edificio as Edificio, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio>('Editar Edificio')))
    .subscribe(data => {
      this.log(`Edificio com código: ${data.codigo} editado com sucesso!`);
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

  private validateString (data : string): boolean{
    if(data === null || data === undefined || data === ""){
      return false;
    }
    return true;
  }

  private validateNumber(data : string, dataName : string): boolean{
    if(data === null || data === undefined || data === ""){
      this.log(`${dataName} não pode ser vazio`);
      return false;
    }else if(isNaN(+data)){
      this.log(`${dataName} deve ser um número`);
      return false;
    }
    return true;
  }
}

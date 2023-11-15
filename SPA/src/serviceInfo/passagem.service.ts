import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import Passagem from 'src/dataModel/passagem';

@Injectable({
  providedIn: 'root'
})
export class PassagemService {

  private passagemUrl = 'http://localhost:4000/api/passagem';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }


    criarPassagem(
        id: number,
        codigoEdificioA: string,
        codigoEdificioB: string,
        numeroPisoA: number,
        numeroPisoB: number,
        ): void {
      
    let passagem: Passagem;

    passagem = {
        id: id, 
        codigoEdificioA: codigoEdificioA,
        codigoEdificioB: codigoEdificioB, 
        numeroPisoA: numeroPisoA, 
        numeroPisoB: numeroPisoB
    } as Passagem;

    if(this.validateData(codigoEdificioA, codigoEdificioB, numeroPisoA, numeroPisoB)){
   
      this.criar(passagem);
    }
      
  }

  criar(passagem: Passagem): void{
    let id: number;
    let codigoEdificioA: string;
    let codigoEdificioB: string;
    let numeroPisoA: number;
    let numeroPisoB: number;
    
    this.http.post<Passagem>(this.passagemUrl, passagem, this.httpOptions)
    .pipe(catchError(this.handleError<Passagem>('Adicionar passagem entre pisos')))
    .subscribe({
        next: data=>{ 
            id = data.id;
            codigoEdificioA = data.codigoEdificioA;
            codigoEdificioB = data.codigoEdificioB;
            numeroPisoA = data.numeroPisoA;
            numeroPisoB = data.numeroPisoB;


          if(data.id==null || data.codigoEdificioA == null || data.codigoEdificioB == null || data.numeroPisoA == null || data.numeroPisoB == null){
            this.log("Erro ao criar passagem porque existem parametros nulos!");
          }
          else{
          this.log("passagem com id: "+id+", codigoEdificioA: "+codigoEdificioA+", codigoEdificioB: "+ codigoEdificioB +", numeroPisoA: "+ numeroPisoA + ", numeroPisoB: "+ numeroPisoB + " criado com sucesso!");
          }
          
      }
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

  validateData(
    codigoEdificioA: string,
    codigoEdificioB: string,
    numeroPisoA: number,
    numeroPisoB: number,
    ): boolean{

    let flag:boolean = true;

    if(codigoEdificioA==null || codigoEdificioA==""){
      this.log("Código do edifício A não pode ser vazio!");
      flag=false;
    }
    if(codigoEdificioB==null || codigoEdificioB==""){
      this.log("Código do edifício B não pode ser vazio!");
      flag=false;
    }
    if(numeroPisoA==null || numeroPisoA<0){
      this.log("Número do piso A não pode ser vazio!");
      flag=false;
    }
    if(numeroPisoB==null || numeroPisoB<0){
      this.log("Número do piso B não pode ser vazio!");
      flag=false;
    }
    
    return flag;
  }
}

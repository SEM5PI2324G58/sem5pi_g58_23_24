import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Piso } from '../domain/piso';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class PisoService {

  private pisoUrl = 'http://localhost:4000/api/piso';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }


  criarPiso(codigo: string,
              numeroPiso: number,
              descricaoPiso: string): void{
      
    let piso: Piso;
    if(descricaoPiso==null || descricaoPiso=="" || descricaoPiso== undefined){
      piso = {codigo: codigo, numeroPiso: numeroPiso} as Piso;
    }else{
      piso = {codigo: codigo, numeroPiso: numeroPiso, descricaoPiso: descricaoPiso} as Piso;
    }
    
    if(this.validateData(piso.codigo, piso.numeroPiso)){
      this.addPiso(piso);
    }
      
  }
  

  addPiso(piso: Piso): void{
    let codigo: string;
    let numeroPiso: number;
    let descricaoPiso: string;
    
    this.http.post<Piso>(this.pisoUrl, piso, this.httpOptions)
    .pipe(catchError(this.handleError<Piso>('Criar Piso')))
    .subscribe({
        next: data=>{codigo=data.codigo;
          numeroPiso=data.numeroPiso;
          if(data.descricaoPiso==null)
            this.log("Piso com código: "+codigo+" número: "+numeroPiso+" criado com sucesso!");
          else{
          descricaoPiso=data.descricaoPiso;
          this.log("Piso com código: "+codigo+" número: "+numeroPiso+" e descrição: "+descricaoPiso+" criado com sucesso!");
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

  validateData(codigo: string,
    numeroPiso: number): boolean{

    let flag:boolean = true;

    if(codigo==null || codigo=="" || codigo== undefined){
      this.log("ERRO: Código Deve ser preenchido.");
      flag=false;
    }
    if(numeroPiso==null || numeroPiso==undefined){
      this.log("ERRO: Número do Piso deve ser preenchido.");
      flag=false;
    }
    
    return flag;
  }
}

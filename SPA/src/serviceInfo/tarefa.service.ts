import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';
import { MessageService } from './message.service';
import AlterarEstadoDaTarefa from 'src/dataModel/alterarEstadoDaTarefa';
import Tarefa from 'src/dataModel/tarefa';
import { CriarVigilancia } from 'src/dataModel/criarVigilancia';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private tarefaUrl = devEnvironment.MDTarefas_API_URL + 'Tarefa';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  public criarTarefaVigilancia(nomeVigilancia: string, numeroVigilancia: string, codigoEd: string, numeroPiso: number): void{

    if (this.validarDadosVigilancia(nomeVigilancia, numeroVigilancia, codigoEd, numeroPiso)){
      let tarefaDataModel = {
        tipoTarefa: "Vigilancia",
        nomeVigilancia: nomeVigilancia,
        numeroVigilancia: numeroVigilancia,
        codEdificio: codigoEd,
        numeroPiso: numeroPiso
      } as CriarVigilancia;
  
      
      this.http.post<Tarefa>(this.tarefaUrl, tarefaDataModel, this.httpOptions)
      .pipe(catchError(this.handleError<Tarefa>('Criar tarefa de vigilância')))
      .subscribe({
          next: data=>{
            if(data != null && data != undefined){
              this.log(`Tarefa criada com sucesso`);
            }
          }
      });
      
    }
  }

  private validarDadosVigilancia(nomeVigilancia: string, numeroVigilancia: string, codigoEd: string, numeroPiso: number): boolean{
    if(nomeVigilancia == null || nomeVigilancia == undefined || nomeVigilancia == ""){
      this.log(`ERRO: O nome do contacto de vigilância é um campo obrigatório`);
      return false;
    }
    if(numeroVigilancia == null || numeroVigilancia == undefined || numeroVigilancia == ""){
      this.log(`ERRO: O numero do contacto de vigilância é um campo obrigatório`);
      return false;
    }
    if(codigoEd == null || codigoEd == undefined || codigoEd == ""){
      this.log(`ERRO: O código do edifício é um campo obrigatório`);
      return false;
    }
    if(numeroPiso == null || numeroPiso == undefined){
      this.log(`ERRO: O número do piso é um campo obrigatório`);
      return false;
    }
    return true;
  }

  alterarEstadoTarefa(idTarefa: string, estado: string, codigoRobo: string): void{
    if(idTarefa == null || idTarefa == undefined || idTarefa == ""){
      this.log(`ERRO: O id da tarefa tem de ser válido`);
      return;
    }
    if(estado == null || estado == undefined || estado == ""){
      this.log(`ERRO: O estado da tarefa tem de ser valido`);
      return;
    }

    let alterarEstadoDaTarefa;
    if(codigoRobo == null || codigoRobo == undefined || codigoRobo == ""){
      alterarEstadoDaTarefa = {
        Id: idTarefa,
        Estado: estado,
      } as AlterarEstadoDaTarefa;
    }else{
      alterarEstadoDaTarefa = {
        Id: idTarefa,
        CodigoRobo: codigoRobo,
        Estado: estado,
      } as AlterarEstadoDaTarefa;
    }
    
    this.http.put<Tarefa>(this.tarefaUrl, alterarEstadoDaTarefa, this.httpOptions)
    .pipe(catchError(this.handleError<Tarefa>('Adicionar sala ao piso')))
    .subscribe({
        next: data=>{ 
          let estadoTarefa = data.estadoString;
          let codigo = data.codDispositivo;
          let id = data.id;
          
          if(estadoTarefa == "Aceite"){
            this.log(`Tarefa ${id} foi aceite e irá ser feita pelo robo ${codigo}`);
          }else if(estadoTarefa == "Rejeitada"){
            this.log(`Tarefa ${id} foi rejeitada`);
          }
      }
    });;
  }

  public getTarefasPendentes(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.tarefaUrl + "/tarefasPendentes", this.httpOptions)
      .pipe(
        catchError(this.handleError<Tarefa[]>('getTarefasPendentes'))
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

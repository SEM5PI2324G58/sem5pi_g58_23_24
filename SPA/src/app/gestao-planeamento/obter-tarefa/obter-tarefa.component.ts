import { Component } from '@angular/core';
import { TarefaService } from 'src/serviceInfo/tarefa.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Tarefa from 'src/dataModel/tarefa';

@Component({
  selector: 'app-obter-tarefa',
  templateUrl: './obter-tarefa.component.html',
  styleUrls: ['./obter-tarefa.component.css']
})

export class ObterTarefaComponent {

  constructor(private tarefaService: TarefaService) { }

  selectedCriteria: string | null = null; 
  selectedValue: string | null = null;
  listaTarefas: Tarefa[] | null = [];

  changeValue(email: string){
    this.selectedValue = email;
  }

  add(): void {
    console.log(this.selectedCriteria);
    console.log(this.selectedValue);
    this.tarefaService.obterTarefa(this.selectedCriteria, this.selectedValue)
    .subscribe(data => {
      this.listaTarefas = data;
      console.log(this.listaTarefas);
    });
  }

}

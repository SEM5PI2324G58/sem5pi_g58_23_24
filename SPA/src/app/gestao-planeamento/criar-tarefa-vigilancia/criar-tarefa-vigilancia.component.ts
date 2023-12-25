import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-criar-tarefa-vigilancia',
  templateUrl: './criar-tarefa-vigilancia.component.html',
  styleUrls: ['./criar-tarefa-vigilancia.component.css']
})
export class CriarTarefaVigilanciaComponent {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder){
  }

  ngOnInit() : void {

    this.myForm = this.fb.group({
      nomeVigilancia: ['', Validators.required],
      numeroVigilancia: ['', Validators.required],
      codigoEd: ['', Validators.required],
      numeroPiso: ['', Validators.required],
    });
  }

}

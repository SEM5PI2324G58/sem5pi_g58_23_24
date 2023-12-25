import { Component } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';

@Component({
  selector: 'app-criar-tarefa-pick-up-delivery',
  templateUrl: './criar-tarefa-pick-up-delivery.component.html',
  styleUrls: ['./criar-tarefa-pick-up-delivery.component.css']
})
export class CriarTarefaPickUpDeliveryComponent {
  
  myForm!: FormGroup;

  constructor(private fb: FormBuilder){
  }

  ngOnInit() : void {

    this.myForm = this.fb.group({
      codConf: ['', Validators.required],
      desc: ['', Validators.required],
      nomePickup: ['', Validators.required],
      numeroPickup: ['', Validators.required],
      nomeDelivery: ['', Validators.required],
      numeroDelivery: ['', Validators.required],
      salaInicial: ['', Validators.required],
      salaFinal: ['', Validators.required],
    });
  }

}

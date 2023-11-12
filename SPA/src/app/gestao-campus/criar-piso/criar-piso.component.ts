import { Component, OnInit  } from '@angular/core';
import { PisoService } from '../../../service/piso.service';

@Component({
  selector: 'app-criar-piso',
  templateUrl: './criar-piso.component.html',
  styleUrls: ['./criar-piso.component.css']
})
export class CriarPisoComponent implements OnInit{

  constructor(private pisoService: PisoService) { }

  ngOnInit(): void {  }

  add(codigo: string,
      numeroPiso: number,
      descricaoPiso: string): void {
        
    this.pisoService.criarPiso(codigo, numeroPiso, descricaoPiso);
  }

  logMessage() {
    alert('Button clicked');
  }

}

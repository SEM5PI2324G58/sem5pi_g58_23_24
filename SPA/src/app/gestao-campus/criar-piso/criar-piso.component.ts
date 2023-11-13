import { Component, OnInit  } from '@angular/core';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-criar-piso',
  templateUrl: './criar-piso.component.html',
  styleUrls: ['./criar-piso.component.css']
})
export class CriarPisoComponent implements OnInit{

  constructor(private pisoService: PisoService,private edificioService: EdificioService) { }

  listaCodigos: string[] = [];

  ngOnInit(): void {  
    this.listaCodigos = this.edificioService.listarCodEdificios();
  }

  add(codigo: string,
      numeroPiso: number,
      descricaoPiso: string): void {
        
    this.pisoService.criarPiso(codigo, numeroPiso, descricaoPiso);
  }

  logMessage() {
    alert('Button clicked');
  }

}

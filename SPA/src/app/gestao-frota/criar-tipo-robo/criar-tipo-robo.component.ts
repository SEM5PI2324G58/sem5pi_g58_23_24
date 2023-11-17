import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoRoboService } from 'src/serviceInfo/tipo-robo.service';

@Component({
  selector: 'app-criar-tipo-robo',
  templateUrl: './criar-tipo-robo.component.html',
  styleUrls: ['./criar-tipo-robo.component.css']
})
export class CriarTipoRoboComponent {
  constructor(private tipoRoboService: TipoRoboService) {}
  listaTipoTarefa: string[] = ["Vigilância", "PickUp/Delivery"];
  listaTipoTarefaSelecionados: string[] = [];
  add(marca:string, modelo:string): void {
    this.tipoRoboService.criarTipoRobo(this.listaTipoTarefaSelecionados, marca, modelo);
  }

  selecionarCheckBox(tipoTarefa: string): void {
    const index = this.listaTipoTarefaSelecionados.indexOf(tipoTarefa);

    if (index === -1) {
      this.listaTipoTarefaSelecionados.push(tipoTarefa);
    } else {
      this.listaTipoTarefaSelecionados.splice(index, 1);
    }
  }
}

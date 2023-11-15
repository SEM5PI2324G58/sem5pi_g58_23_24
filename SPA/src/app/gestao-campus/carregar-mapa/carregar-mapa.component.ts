import { Component } from '@angular/core';
import CarregarMapa from '../../../dataModel/carregarMapa';
import { MessageService } from 'src/serviceInfo/message.service';
import { MapaService } from 'src/serviceInfo/mapa.service';

@Component({
  selector: 'app-carregar-mapa',
  templateUrl: './carregar-mapa.component.html',
  styleUrls: ['./carregar-mapa.component.css']
})
export class CarregarMapaComponent {
  constructor(private mapaService : MapaService) { }
  file:any;

  getFile(event: any) {
    const reader = new FileReader();
    this.file = event.target.files[0];

    let mapaData: CarregarMapa | undefined; // Declare a variable to store the parsed JSON data
    reader.readAsText(this.file);
     reader.onload = () => {
      try {
        mapaData = JSON.parse(reader.result as string) as CarregarMapa;
        this.mapaService.carregarMapa(mapaData);
      } catch (error) {
        
      }
    };
  }

}

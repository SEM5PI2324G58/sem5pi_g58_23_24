import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-criar-elevador',
  templateUrl: './criar-elevador.component.html',
  styleUrls: ['./criar-elevador.component.css']
})
export class CriarElevadorComponent {

  listaCodEd: string[] = [];
  pisosEd:{ item_id: number, item_text: string }[] = [];

  dropdownSettings:IDropdownSettings={};
  
  constructor(private edificioService: EdificioService) { }

  ngOnInit() : void {

  
  this.listaCodEd = this.edificioService.listarCodEdificios();

    this.pisosEd = [
      { item_id: 1, item_text: '1' },
      { item_id: 2, item_text: '2' },
      { item_id: 3, item_text: '3' },
      { item_id: 4, item_text: '4' },
      { item_id: 5, item_text: '20' }
    ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      noDataAvailablePlaceholderText: "Não existem pisos disponíveis",
    };
  }

}

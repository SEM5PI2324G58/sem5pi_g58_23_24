import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExportarDadosPessoaisComponent } from './exportar-dados-pessoais.component';
import { SidebarContaComponent } from '../sidebar-conta/sidebar-conta.component';
import { MessageComponent } from '../../message/message.component';
import { ContaService } from 'src/serviceInfo/conta.service';
import { of } from 'rxjs';

describe('ExportarDadosPessoaisComponent', () => {
  let component: ExportarDadosPessoaisComponent;
  let fixture: ComponentFixture<ExportarDadosPessoaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportarDadosPessoaisComponent, SidebarContaComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportarDadosPessoaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método export chama o método exportarDadosPessoais de contaService', () => {
    let conta = {
      role: "role",
      email: "email",
      password: "password",
      estado: "estado",
      nome: "nome",
      telefone: 123456789,
      contribuinte: 123456789
    };
    let contaService = TestBed.inject(ContaService);
    let spy = spyOn(component['contaService'], 'exportarDadosPessoais').and.returnValue(of(conta));
    component.export();
    expect(spy).toHaveBeenCalled();

  });
});

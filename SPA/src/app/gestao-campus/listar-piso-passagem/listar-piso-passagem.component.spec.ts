import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ListarPisoPassagemComponent } from './listar-piso-passagem.component';

describe('ListarPisoComponent', () => {
  let component: ListarPisoPassagemComponent;
  let fixture: ComponentFixture<ListarPisoPassagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPisoPassagemComponent]
    });
    fixture = TestBed.createComponent(ListarPisoPassagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

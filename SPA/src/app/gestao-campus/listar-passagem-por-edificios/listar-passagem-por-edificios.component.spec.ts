import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPassagemPorEdificiosComponent } from './listar-passagem-por-edificios.component';

describe('ListarPassagemPorEdificiosComponent', () => {
  let component: ListarPassagemPorEdificiosComponent;
  let fixture: ComponentFixture<ListarPassagemPorEdificiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPassagemPorEdificiosComponent]
    });
    fixture = TestBed.createComponent(ListarPassagemPorEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

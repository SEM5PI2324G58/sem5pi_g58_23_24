import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDispositivosFrotaComponent } from './listar-dispositivos-frota.component';

describe('ListarDispositivosFrotaComponent', () => {
  let component: ListarDispositivosFrotaComponent;
  let fixture: ComponentFixture<ListarDispositivosFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarDispositivosFrotaComponent]
    });
    fixture = TestBed.createComponent(ListarDispositivosFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEdificioMinMaxPisosComponent } from './listar-edificio-min-max-pisos.component';

describe('ListarEdificioMinMaxPisosComponent', () => {
  let component: ListarEdificioMinMaxPisosComponent;
  let fixture: ComponentFixture<ListarEdificioMinMaxPisosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarEdificioMinMaxPisosComponent]
    });
    fixture = TestBed.createComponent(ListarEdificioMinMaxPisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

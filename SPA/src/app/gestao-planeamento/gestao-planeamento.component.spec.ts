import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoPlaneamentoComponent } from './gestao-planeamento.component';

describe('GestaoPlaneamentoComponent', () => {
  let component: GestaoPlaneamentoComponent;
  let fixture: ComponentFixture<GestaoPlaneamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoPlaneamentoComponent]
    });
    fixture = TestBed.createComponent(GestaoPlaneamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

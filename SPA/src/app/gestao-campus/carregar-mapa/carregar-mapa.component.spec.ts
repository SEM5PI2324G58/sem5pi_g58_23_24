import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarregarMapaComponent } from './carregar-mapa.component';

describe('CarregarMapaComponent', () => {
  let component: CarregarMapaComponent;
  let fixture: ComponentFixture<CarregarMapaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarregarMapaComponent]
    });
    fixture = TestBed.createComponent(CarregarMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

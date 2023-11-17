import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarElevadorComponent } from './listar-elevador.component';

describe('ListarElevadorComponent', () => {
  let component: ListarElevadorComponent;
  let fixture: ComponentFixture<ListarElevadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarElevadorComponent]
    });
    fixture = TestBed.createComponent(ListarElevadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

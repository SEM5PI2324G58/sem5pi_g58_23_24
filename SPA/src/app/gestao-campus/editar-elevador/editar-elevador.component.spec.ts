import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarElevadorComponent } from './editar-elevador.component';

describe('EditarElevadorComponent', () => {
  let component: EditarElevadorComponent;
  let fixture: ComponentFixture<EditarElevadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarElevadorComponent]
    });
    fixture = TestBed.createComponent(EditarElevadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

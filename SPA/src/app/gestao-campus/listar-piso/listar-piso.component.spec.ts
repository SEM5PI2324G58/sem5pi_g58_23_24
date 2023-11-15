import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ListarPisoComponent } from './listar-piso.component';

describe('ListarPisoComponent', () => {
  let component: ListarPisoComponent;
  let fixture: ComponentFixture<ListarPisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPisoComponent]
    });
    fixture = TestBed.createComponent(ListarPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

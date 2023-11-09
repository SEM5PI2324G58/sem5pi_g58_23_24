import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoFrotaComponent } from './gestao-frota.component';

describe('GestaoFrotaComponent', () => {
  let component: GestaoFrotaComponent;
  let fixture: ComponentFixture<GestaoFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoFrotaComponent]
    });
    fixture = TestBed.createComponent(GestaoFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

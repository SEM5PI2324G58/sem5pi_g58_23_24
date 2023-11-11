import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPisoComponent } from './criar-piso.component';

describe('CriarPisoComponent', () => {
  let component: CriarPisoComponent;
  let fixture: ComponentFixture<CriarPisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarPisoComponent]
    });
    fixture = TestBed.createComponent(CriarPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

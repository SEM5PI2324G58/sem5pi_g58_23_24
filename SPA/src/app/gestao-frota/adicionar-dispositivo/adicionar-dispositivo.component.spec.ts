import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarDispositivoComponent } from './adicionar-dispositivo.component';

describe('AdicionarDispositivoComponent', () => {
  let component: AdicionarDispositivoComponent;
  let fixture: ComponentFixture<AdicionarDispositivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdicionarDispositivoComponent]
    });
    fixture = TestBed.createComponent(AdicionarDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

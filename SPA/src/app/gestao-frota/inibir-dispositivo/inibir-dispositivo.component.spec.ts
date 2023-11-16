import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarTipoRoboComponent } from './criar-tipo-robo.component';

describe('CriarTipoRoboComponent', () => {
  let component: CriarTipoRoboComponent;
  let fixture: ComponentFixture<CriarTipoRoboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarTipoRoboComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarTipoRoboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPassagemComponent } from './criar-passagem.component';

describe('CriarEdificioComponent', () => {
  let component: CriarPassagemComponent;
  let fixture: ComponentFixture<CriarPassagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarPassagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarPassagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

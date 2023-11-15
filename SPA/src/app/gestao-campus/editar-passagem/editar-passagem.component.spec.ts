import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPassagemComponent } from './editar-passagem.component';

describe('CriarEdificioComponent', () => {
  let component: EditarPassagemComponent;
  let fixture: ComponentFixture<EditarPassagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPassagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPassagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

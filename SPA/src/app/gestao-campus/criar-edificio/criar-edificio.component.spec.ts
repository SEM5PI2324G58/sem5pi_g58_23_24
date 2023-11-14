import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarEdificioComponent } from './criar-edificio.component';

describe('CriarEdificioComponent', () => {
  let component: CriarEdificioComponent;
  let fixture: ComponentFixture<CriarEdificioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarEdificioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarEdificioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

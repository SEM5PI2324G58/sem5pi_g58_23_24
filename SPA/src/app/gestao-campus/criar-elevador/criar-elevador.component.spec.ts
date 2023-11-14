import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarElevadorComponent } from './criar-elevador.component';

describe('CriarElevadorComponent', () => {
  let component: CriarElevadorComponent;
  let fixture: ComponentFixture<CriarElevadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarElevadorComponent]
    });
    fixture = TestBed.createComponent(CriarElevadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

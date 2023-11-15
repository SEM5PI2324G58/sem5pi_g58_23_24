import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visualizacao3DComponent } from './visualizacao3-d.component';

describe('Visualizacao3DComponent', () => {
  let component: Visualizacao3DComponent;
  let fixture: ComponentFixture<Visualizacao3DComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Visualizacao3DComponent]
    });
    fixture = TestBed.createComponent(Visualizacao3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

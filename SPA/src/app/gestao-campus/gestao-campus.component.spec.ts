import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoCampusComponent } from './gestao-campus.component';

describe('GestaoCampusComponent', () => {
  let component: GestaoCampusComponent;
  let fixture: ComponentFixture<GestaoCampusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoCampusComponent]
    });
    fixture = TestBed.createComponent(GestaoCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

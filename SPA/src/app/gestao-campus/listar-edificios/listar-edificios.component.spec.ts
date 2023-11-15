import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEdificiosComponent } from './listar-edificios.component';

describe('ListarEdificiosComponent', () => {
  let component: ListarEdificiosComponent;
  let fixture: ComponentFixture<ListarEdificiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarEdificiosComponent]
    });
    fixture = TestBed.createComponent(ListarEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

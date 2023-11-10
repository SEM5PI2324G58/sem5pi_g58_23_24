import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFrotaComponent } from './sidebar-frota.component';

describe('SidebarFrotaComponent', () => {
  let component: SidebarFrotaComponent;
  let fixture: ComponentFixture<SidebarFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarFrotaComponent]
    });
    fixture = TestBed.createComponent(SidebarFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

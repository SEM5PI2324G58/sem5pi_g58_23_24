import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoFrotaComponent } from './gestao-frota.component';
import { SidebarFrotaComponent } from './sidebar-frota/sidebar-frota.component';

describe('GestaoFrotaComponent', () => {
  let component: GestaoFrotaComponent;
  let fixture: ComponentFixture<GestaoFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoFrotaComponent, SidebarFrotaComponent],
    });
    fixture = TestBed.createComponent(GestaoFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

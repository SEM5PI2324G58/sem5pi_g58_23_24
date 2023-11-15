import { TestBed } from '@angular/core/testing';

import { ElevadorService } from './elevador.service';

describe('ElevadorService', () => {
  let service: ElevadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

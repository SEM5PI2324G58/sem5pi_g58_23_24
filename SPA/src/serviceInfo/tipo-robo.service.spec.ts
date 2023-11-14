import { TestBed } from '@angular/core/testing';

import { TipoRoboService } from './tipo-robo.service';

describe('TipoRoboService', () => {
  let service: TipoRoboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRoboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

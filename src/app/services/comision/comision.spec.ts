import { TestBed } from '@angular/core/testing';

import { ComisionService } from './comision.service';

describe('Comision', () => {
  let service: ComisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

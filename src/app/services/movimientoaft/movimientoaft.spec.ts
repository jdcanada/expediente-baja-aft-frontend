import { TestBed } from '@angular/core/testing';

import { MovimientoaftService } from './movimientoaft.service';

describe('Movimientoaft', () => {
  let service: MovimientoaftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoaftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

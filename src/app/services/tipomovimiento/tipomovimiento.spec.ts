import { TestBed } from '@angular/core/testing';

import { TipoMovimientoService } from './tipomovimiento.service';

describe('Tipomovimiento', () => {
  let service: TipoMovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMovimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

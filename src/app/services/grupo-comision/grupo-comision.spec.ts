import { TestBed } from '@angular/core/testing';

import { GrupoComisionService } from './grupo-comision.service';

describe('GrupoComision', () => {
  let service: GrupoComisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoComisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

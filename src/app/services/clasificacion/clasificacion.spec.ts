import { TestBed } from '@angular/core/testing';

import { ClasificacionService } from './clasificacion.service';

describe('Clasificacion', () => {
  let service: ClasificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

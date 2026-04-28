import { TestBed } from '@angular/core/testing';

import { ComisionmiembrosService } from './comisionmiembros.service';

describe('Comisionmiembros', () => {
  let service: ComisionmiembrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComisionmiembrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

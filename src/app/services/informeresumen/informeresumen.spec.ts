import { TestBed } from '@angular/core/testing';

import { InformeresumenService } from './informeresumen.service';

describe('Informeresumen', () => {
  let service: InformeresumenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformeresumenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DirectivoService } from './directivo.service';

describe('Directivo', () => {
  let service: DirectivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MediobasicoService } from './mediobasico.service';

describe('Mediobasico', () => {
  let service: MediobasicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediobasicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

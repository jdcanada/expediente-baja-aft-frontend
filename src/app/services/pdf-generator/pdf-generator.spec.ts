import { TestBed } from '@angular/core/testing';

import { PdfGeneratorService } from './pdf-generator.service';

describe('PdfGenerator', () => {
  let service: PdfGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { DestinoFinal } from '../../models/destino-final';
import { DestinoFinalService } from './destino-final.service';


describe('Mediobasico', () => {
  let service: DestinoFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinoFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

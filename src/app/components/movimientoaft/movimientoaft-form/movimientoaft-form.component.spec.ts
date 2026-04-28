import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoaftForm } from './movimientoaft-form.component';

describe('MovimientoaftForm', () => {
  let component: MovimientoaftForm;
  let fixture: ComponentFixture<MovimientoaftForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoaftForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoaftForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

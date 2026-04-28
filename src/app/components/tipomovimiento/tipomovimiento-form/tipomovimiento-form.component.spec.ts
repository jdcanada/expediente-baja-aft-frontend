import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomovimientoForm } from './tipomovimiento-form.component';

describe('TipomovimientoForm', () => {
  let component: TipomovimientoForm;
  let fixture: ComponentFixture<TipomovimientoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipomovimientoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipomovimientoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionForm } from './comision-form.component';

describe('ComisionForm', () => {
  let component: ComisionForm;
  let fixture: ComponentFixture<ComisionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComisionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeresumenForm } from './informeresumen-form.component';

describe('InformeresumenForm', () => {
  let component: InformeresumenForm;
  let fixture: ComponentFixture<InformeresumenForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeresumenForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeresumenForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

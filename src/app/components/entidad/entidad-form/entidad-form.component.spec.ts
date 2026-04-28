import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadForm } from './entidad-form.component';

describe('EntidadForm', () => {
  let component: EntidadForm;
  let fixture: ComponentFixture<EntidadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

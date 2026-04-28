import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionmiembrosForm } from './comisionmiembros-form.component';

describe('ComisionmiembrosForm', () => {
  let component: ComisionmiembrosForm;
  let fixture: ComponentFixture<ComisionmiembrosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionmiembrosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComisionmiembrosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

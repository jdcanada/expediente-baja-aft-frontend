import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoComisionForm } from './grupo-comision-form.component';

describe('GrupoComisionForm', () => {
  let component: GrupoComisionForm;
  let fixture: ComponentFixture<GrupoComisionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoComisionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoComisionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
